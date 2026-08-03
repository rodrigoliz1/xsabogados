import {
  AppointmentModality,
  AppointmentStatus,
  CalendarSyncStatus,
  Prisma,
} from "@prisma/client";

import {
  formatDateInTimeZone,
  formatTimeInTimeZone,
  getCalendarProvider,
  reservationSlotStarts,
} from "@/lib/calendar";
import { db } from "@/lib/db";
import { renderTransactionalEmail, sendTrackedEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/site-url";
import {
  createPublicReference,
  createSecureToken,
} from "@/lib/security/tokens";
import type { AppointmentInput } from "@/lib/validation";
import { trackServerEvent } from "@/lib/analytics";
import { getAvailabilityDetails } from "@/server/services/availability-service";
import {
  ReservationConflictError,
  ResourceNotFoundError,
} from "@/server/services/errors";
import {
  createDevelopmentAppointment,
  developmentMemoryEnabled,
} from "@/server/services/dev-memory";

const modalityMap = {
  PRESENCIAL: AppointmentModality.IN_PERSON,
  VIDEOLLAMADA: AppointmentModality.VIDEO_CALL,
  TELEFONICA: AppointmentModality.PHONE_CALL,
} as const;

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function createAppointment(input: AppointmentInput) {
  if (developmentMemoryEnabled()) {
    const result = createDevelopmentAppointment(input);
    trackServerEvent("appointment_requested", {
      modality: input.modality,
      assignedProfessional: Boolean(input.lawyerId),
      provider: "development-memory",
    });
    return { reference: result.reference, status: AppointmentStatus.REQUESTED };
  }
  const [practiceArea, availability] = await Promise.all([
    db.practiceArea.findFirst({
      where: { slug: input.practiceArea, active: true },
      select: { id: true, name: true },
    }),
    getAvailabilityDetails({ date: input.date, lawyerId: input.lawyerId }),
  ]);
  if (!practiceArea)
    throw new ResourceNotFoundError(
      "El área de práctica seleccionada no existe.",
    );
  const selectedSlot = availability.find((slot) => slot.label === input.time);
  if (!selectedSlot) throw new ReservationConflictError();

  const reference = createPublicReference("CITA");
  const { token: manageToken, tokenHash: manageTokenHash } =
    createSecureToken();
  const reservationStarts = reservationSlotStarts(
    selectedSlot.startsAt,
    selectedSlot.durationMinutes,
    selectedSlot.bufferMinutes,
  );

  let appointment: { id: string; reference: string };
  try {
    appointment = await db.appointment.create({
      data: {
        reference,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        company: input.company,
        practiceAreaId: practiceArea.id,
        lawyerId: selectedSlot.lawyerId,
        modality: modalityMap[input.modality],
        startAt: selectedSlot.startsAt,
        endAt: selectedSlot.endsAt,
        timezone: selectedSlot.timezone,
        description: input.description,
        privacyAcceptedAt: new Date(),
        manageTokenHash,
        status: AppointmentStatus.REQUESTED,
        calendarSyncStatus: CalendarSyncStatus.PENDING,
        reservationSlots: {
          create: reservationStarts.map((startsAt) => ({
            resourceKey: selectedSlot.resourceKey,
            startsAt,
          })),
        },
      },
      select: { id: true, reference: true },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) throw new ReservationConflictError();
    throw error;
  }

  let status: AppointmentStatus = AppointmentStatus.REQUESTED;
  try {
    const calendar = getCalendarProvider();
    if (calendar.name === "mock") {
      await db.appointment.update({
        where: { id: appointment.id },
        data: {
          status: AppointmentStatus.REQUESTED,
          externalEventId: null,
          calendarSyncStatus: CalendarSyncStatus.NOT_REQUIRED,
          calendarSyncError: null,
        },
      });
    } else {
      const event = await calendar.createEvent({
        reference,
        startsAt: selectedSlot.startsAt,
        endsAt: selectedSlot.endsAt,
        timezone: selectedSlot.timezone,
        modality: modalityMap[input.modality],
        attendeeName: input.fullName,
        attendeeEmail: input.email,
        practiceAreaName: practiceArea.name,
      });
      status = AppointmentStatus.CONFIRMED;
      await db.appointment.update({
        where: { id: appointment.id },
        data: {
          status,
          externalEventId: event.externalEventId,
          calendarSyncStatus: CalendarSyncStatus.SYNCED,
          calendarSyncError: null,
        },
      });
    }
  } catch (error) {
    status = AppointmentStatus.PENDING_SYNC;
    await db.appointment.update({
      where: { id: appointment.id },
      data: {
        status,
        calendarSyncStatus: CalendarSyncStatus.FAILED,
        calendarSyncError:
          error instanceof Error
            ? error.message.slice(0, 500)
            : "Error de sincronización",
      },
    });
  }

  const siteUrl = getSiteUrl();
  const manageUrl = new URL("/agenda", siteUrl);
  manageUrl.searchParams.set("gestionar", manageToken);
  const localDate = formatDateInTimeZone(
    selectedSlot.startsAt,
    selectedSlot.timezone,
  );
  const localTime = formatTimeInTimeZone(
    selectedSlot.startsAt,
    selectedSlot.timezone,
  );
  const lawyer = selectedSlot.lawyerId
    ? await db.lawyerProfile.findUnique({
        where: { id: selectedSlot.lawyerId },
        select: { displayName: true },
      })
    : null;
  const modalityLabel = {
    PRESENCIAL: "Presencial",
    VIDEOLLAMADA: "Videollamada",
    TELEFONICA: "Llamada telefónica",
  }[input.modality];
  const commonDetails = [
    { label: "Referencia", value: reference },
    { label: "Fecha", value: localDate },
    { label: "Hora", value: localTime },
    { label: "Zona horaria", value: selectedSlot.timezone },
    { label: "Modalidad", value: modalityLabel },
    { label: "Área", value: practiceArea.name },
    { label: "Profesional solicitado", value: lawyer?.displayName },
  ];
  const clientEmail = renderTransactionalEmail({
    eyebrow: "Agenda",
    title:
      status === AppointmentStatus.CONFIRMED
        ? "Su cita fue confirmada"
        : "Solicitud de cita recibida",
    greeting: `Hola ${input.fullName},`,
    paragraphs: [
      status === AppointmentStatus.CONFIRMED
        ? "La cita quedó registrada y sincronizada con el calendario de la firma."
        : "Registramos su solicitud. El equipo confirmará la disponibilidad por un canal de contacto autorizado.",
    ],
    details: commonDetails,
    action: { label: "Gestionar solicitud", url: manageUrl.toString() },
  });
  const officeEmail = renderTransactionalEmail({
    eyebrow: "Nueva solicitud",
    title: `Nueva cita ${reference}`,
    paragraphs: [
      "Se registró una nueva solicitud de cita en el sistema.",
      `Contacto: ${input.fullName} · ${input.email} · ${input.phone}`,
      `Descripción breve: ${input.description}`,
    ],
    details: commonDetails,
    action: {
      label: "Abrir panel administrativo",
      url: new URL("/admin/citas", siteUrl).toString(),
    },
  });
  const officeRecipient =
    process.env.CONTACT_RECIPIENT_EMAIL || "contacto@xs-abogados.com";

  await Promise.allSettled([
    sendTrackedEmail({
      to: input.email,
      subject:
        status === AppointmentStatus.CONFIRMED
          ? `Cita confirmada · ${reference}`
          : `Solicitud de cita recibida · ${reference}`,
      template: "appointment-client",
      ...clientEmail,
      tags: ["appointment", "client"],
      metadata: { "X-XS-Reference": reference },
    }),
    sendTrackedEmail({
      to: officeRecipient,
      subject: `Nueva solicitud de cita · ${reference}`,
      template: "appointment-office",
      ...officeEmail,
      replyTo: input.email,
      tags: ["appointment", "office"],
      metadata: { "X-XS-Reference": reference },
    }),
  ]);

  await db.auditLog.create({
    data: {
      action: "APPOINTMENT_CREATED",
      entityType: "Appointment",
      entityId: appointment.id,
      metadata: { reference, status },
    },
  });
  trackServerEvent("appointment_requested", {
    modality: input.modality,
    assignedProfessional: Boolean(input.lawyerId),
  });

  return { reference, status };
}
