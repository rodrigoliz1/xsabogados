import { AppointmentStatus, CalendarSyncStatus } from "@prisma/client";

import { getCalendarProvider, zonedDateTimeToUtc } from "@/lib/calendar";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/security/tokens";
import type {
  appointmentCancellationSchema,
  appointmentRescheduleRequestSchema,
} from "@/lib/validation";
import type { z } from "zod";

import { ResourceNotFoundError, ServiceError } from "./errors";

type CancellationInput = z.infer<typeof appointmentCancellationSchema>;
type RescheduleInput = z.infer<typeof appointmentRescheduleRequestSchema>;

export async function cancelAppointment(input: CancellationInput) {
  const appointment = await db.appointment.findUnique({
    where: { manageTokenHash: hashToken(input.token) },
    select: { id: true, reference: true, status: true, externalEventId: true },
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
  return { reference: appointment.reference };
}

export async function requestAppointmentReschedule(input: RescheduleInput) {
  const appointment = await db.appointment.findUnique({
    where: { manageTokenHash: hashToken(input.token) },
    select: { id: true, reference: true, status: true, timezone: true },
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
  return { reference: appointment.reference };
}
