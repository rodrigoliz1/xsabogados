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
import { escapeEmailHtml, sendTrackedEmail } from "@/lib/email";
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
    return { reference: result.reference, status: AppointmentStatus.CONFIRMED };
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

  let status: AppointmentStatus = AppointmentStatus.CONFIRMED;
  try {
    const calendar = getCalendarProvider();
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
    await db.appointment.update({
      where: { id: appointment.id },
      data: {
        status: AppointmentStatus.CONFIRMED,
        externalEventId: event.externalEventId,
        calendarSyncStatus: CalendarSyncStatus.SYNCED,
        calendarSyncError: null,
      },
    });
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
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
  const confirmationText = `Recibimos tu cita ${reference} para ${localDate} a las ${localTime}. Puedes gestionarla en ${manageUrl.toString()}`;

  await sendTrackedEmail({
    to: input.email,
    subject: `Cita ${reference} · XS ABOGADOS`,
    template: "appointment-confirmation",
    text: confirmationText,
    html: `<p>Hola ${escapeEmailHtml(input.fullName)},</p><p>${escapeEmailHtml(
      confirmationText,
    )}</p><p><a href="${escapeEmailHtml(manageUrl.toString())}">Gestionar cita</a></p>`,
    metadata: { "X-XS-Reference": reference },
  }).catch(() => undefined);

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
