import { AppointmentStatus, CalendarSyncStatus } from "@prisma/client";

import {
  formatDateInTimeZone,
  formatTimeInTimeZone,
  getCalendarProvider,
  zonedDateTimeToUtc,
} from "@/lib/calendar";
import { db } from "@/lib/db";
import { renderTransactionalEmail, sendTrackedEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/site-url";
import { hashToken } from "@/lib/security/tokens";
import type {
  appointmentCancellationSchema,
  appointmentRescheduleRequestSchema,
} from "@/lib/validation";
import type { z } from "zod";

import { ResourceNotFoundError, ServiceError } from "./errors";

type CancellationInput = z.infer<typeof appointmentCancellationSchema>;
type RescheduleInput = z.infer<typeof appointmentRescheduleRequestSchema>;

const modalityLabels = {
  IN_PERSON: "Presencial",
  VIDEO_CALL: "Videollamada",
  PHONE_CALL: "Llamada telefónica",
} as const;

type AppointmentEmailContext = {
  reference: string;
  fullName: string;
  email: string;
  startAt: Date;
  timezone: string;
  modality: keyof typeof modalityLabels;
  practiceArea: { name: string };
  lawyer: { displayName: string } | null;
};

function appointmentEmailDetails(appointment: AppointmentEmailContext) {
  return [
    { label: "Referencia", value: appointment.reference },
    {
      label: "Fecha",
      value: formatDateInTimeZone(appointment.startAt, appointment.timezone),
    },
    {
      label: "Hora",
      value: formatTimeInTimeZone(appointment.startAt, appointment.timezone),
    },
    { label: "Zona horaria", value: appointment.timezone },
    { label: "Modalidad", value: modalityLabels[appointment.modality] },
    { label: "Área", value: appointment.practiceArea.name },
    {
      label: "Profesional",
      value: appointment.lawyer?.displayName,
    },
  ];
}

async function notifyAppointmentCancellation(
  appointment: AppointmentEmailContext,
) {
  const details = appointmentEmailDetails(appointment);
  const clientEmail = renderTransactionalEmail({
    eyebrow: "Agenda",
    title: "Cita cancelada",
    greeting: `Hola ${appointment.fullName},`,
    paragraphs: [
      "La cita indicada a continuación fue cancelada conforme a la solicitud recibida.",
    ],
    details,
    action: {
      label: "Solicitar una nueva cita",
      url: new URL("/agenda", getSiteUrl()).toString(),
    },
  });
  const officeEmail = renderTransactionalEmail({
    eyebrow: "Agenda",
    title: `Cita cancelada ${appointment.reference}`,
    paragraphs: [
      `La cancelación fue solicitada por ${appointment.fullName} (${appointment.email}).`,
    ],
    details,
    action: {
      label: "Abrir panel de citas",
      url: new URL("/admin/citas", getSiteUrl()).toString(),
    },
  });
  await Promise.allSettled([
    sendTrackedEmail({
      to: appointment.email,
      subject: `Cita cancelada · ${appointment.reference}`,
      template: "appointment-cancelled-client",
      ...clientEmail,
      tags: ["appointment", "cancelled", "client"],
    }),
    sendTrackedEmail({
      to: process.env.CONTACT_RECIPIENT_EMAIL || "contacto@xs-abogados.com",
      subject: `Cita cancelada · ${appointment.reference}`,
      template: "appointment-cancelled-office",
      ...officeEmail,
      replyTo: appointment.email,
      tags: ["appointment", "cancelled", "office"],
    }),
  ]);
}

async function notifyAppointmentReschedule(
  appointment: AppointmentEmailContext,
  requestedStartAt: Date,
) {
  const details = [
    ...appointmentEmailDetails(appointment),
    {
      label: "Nueva fecha solicitada",
      value: formatDateInTimeZone(requestedStartAt, appointment.timezone),
    },
    {
      label: "Nueva hora solicitada",
      value: formatTimeInTimeZone(requestedStartAt, appointment.timezone),
    },
  ];
  const clientEmail = renderTransactionalEmail({
    eyebrow: "Agenda",
    title: "Solicitud de reprogramación recibida",
    greeting: `Hola ${appointment.fullName},`,
    paragraphs: [
      "Registramos la nueva fecha solicitada. El equipo confirmará el cambio antes de considerarlo definitivo.",
    ],
    details,
  });
  const officeEmail = renderTransactionalEmail({
    eyebrow: "Agenda",
    title: `Reprogramación solicitada ${appointment.reference}`,
    paragraphs: [
      `${appointment.fullName} (${appointment.email}) solicitó una nueva fecha para su cita.`,
    ],
    details,
    action: {
      label: "Revisar solicitud",
      url: new URL("/admin/citas", getSiteUrl()).toString(),
    },
  });
  await Promise.allSettled([
    sendTrackedEmail({
      to: appointment.email,
      subject: `Reprogramación recibida · ${appointment.reference}`,
      template: "appointment-reschedule-client",
      ...clientEmail,
      tags: ["appointment", "reschedule", "client"],
    }),
    sendTrackedEmail({
      to: process.env.CONTACT_RECIPIENT_EMAIL || "contacto@xs-abogados.com",
      subject: `Reprogramación solicitada · ${appointment.reference}`,
      template: "appointment-reschedule-office",
      ...officeEmail,
      replyTo: appointment.email,
      tags: ["appointment", "reschedule", "office"],
    }),
  ]);
}

export async function cancelAppointment(input: CancellationInput) {
  const appointment = await db.appointment.findUnique({
    where: { manageTokenHash: hashToken(input.token) },
    select: {
      id: true,
      reference: true,
      status: true,
      externalEventId: true,
      fullName: true,
      email: true,
      startAt: true,
      timezone: true,
      modality: true,
      practiceArea: { select: { name: true } },
      lawyer: { select: { displayName: true } },
    },
  });
  if (!appointment)
    throw new ResourceNotFoundError("La liga de gestión no es válida.");
  if (
    appointment.status === AppointmentStatus.COMPLETED ||
    appointment.status === AppointmentStatus.CANCELLED
  ) {
    throw new ServiceError(
      "La cita ya no puede cancelarse.",
      409,
      "APPOINTMENT_NOT_CHANGEABLE",
    );
  }

  await db.$transaction([
    db.appointmentReservationSlot.deleteMany({
      where: { appointmentId: appointment.id },
    }),
    db.appointment.update({
      where: { id: appointment.id },
      data: {
        status: AppointmentStatus.CANCELLED,
        cancelledAt: new Date(),
        internalNotes: input.reason
          ? `Cancelación solicitada: ${input.reason}`
          : undefined,
      },
    }),
    db.appointmentChangeRequest.create({
      data: {
        appointmentId: appointment.id,
        type: "CANCEL",
        status: "APPROVED",
        reason: input.reason,
        resolvedAt: new Date(),
      },
    }),
  ]);

  if (appointment.externalEventId) {
    try {
      await getCalendarProvider().cancelEvent(appointment.externalEventId);
    } catch (error) {
      await db.appointment.update({
        where: { id: appointment.id },
        data: {
          calendarSyncStatus: CalendarSyncStatus.FAILED,
          calendarSyncError:
            error instanceof Error
              ? error.message.slice(0, 500)
              : "Error al cancelar evento",
        },
      });
    }
  }
  await notifyAppointmentCancellation(appointment);
  return { reference: appointment.reference };
}

export async function requestAppointmentReschedule(input: RescheduleInput) {
  const appointment = await db.appointment.findUnique({
    where: { manageTokenHash: hashToken(input.token) },
    select: {
      id: true,
      reference: true,
      status: true,
      timezone: true,
      fullName: true,
      email: true,
      startAt: true,
      modality: true,
      practiceArea: { select: { name: true } },
      lawyer: { select: { displayName: true } },
    },
  });
  if (!appointment)
    throw new ResourceNotFoundError("La liga de gestión no es válida.");
  if (
    appointment.status === AppointmentStatus.COMPLETED ||
    appointment.status === AppointmentStatus.CANCELLED
  ) {
    throw new ServiceError(
      "La cita ya no puede reprogramarse.",
      409,
      "APPOINTMENT_NOT_CHANGEABLE",
    );
  }
  const requestedStartAt = zonedDateTimeToUtc(
    input.date,
    input.time,
    appointment.timezone,
  );
  if (requestedStartAt <= new Date()) {
    throw new ServiceError(
      "La nueva fecha debe ser futura.",
      400,
      "INVALID_APPOINTMENT_DATE",
    );
  }

  await db.$transaction([
    db.appointment.update({
      where: { id: appointment.id },
      data: { status: AppointmentStatus.RESCHEDULE_REQUESTED },
    }),
    db.appointmentChangeRequest.create({
      data: {
        appointmentId: appointment.id,
        type: "RESCHEDULE",
        requestedStartAt,
        reason: input.reason,
      },
    }),
  ]);
  await notifyAppointmentReschedule(appointment, requestedStartAt);
  return { reference: appointment.reference };
}
