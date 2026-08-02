import { Prisma, Visibility } from "@prisma/client";

import { db } from "@/lib/db";
import type { z } from "zod";
import type { portalMessageSchema } from "@/lib/validation";
import { toMatterSummaryDTO, toVisibleTimelineItem } from "@/server/dto/matter";
import {
  canSeeInternalContent,
  matterWhereForActor,
  requireMatterAccess,
  type PolicyActor,
} from "@/server/policies";
import { AccessDeniedError } from "@/server/services/errors";

type PortalMessageInput = z.infer<typeof portalMessageSchema>;

export async function getPortalSummary(actor: PolicyActor) {
  const matterWhere = matterWhereForActor(actor);
  const appointmentWhere: Prisma.AppointmentWhereInput =
    actor.role === "ADMIN"
      ? {}
      : actor.role === "CLIENT"
        ? actor.clientProfileId
          ? { clientId: actor.clientProfileId }
          : { id: "__none__" }
        : actor.lawyerProfileId
          ? { lawyerId: actor.lawyerProfileId }
          : { id: "__none__" };

  const [matters, appointments, unreadNotifications] = await Promise.all([
    db.matter.findMany({
      where: matterWhere,
      select: {
        id: true,
        reference: true,
        title: true,
        status: true,
        stage: true,
        nextActionAt: true,
        nextActionPublic: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 30,
    }),
    db.appointment.findMany({
      where: {
        ...appointmentWhere,
        startAt: { gte: new Date() },
        status: {
          in: [
            "REQUESTED",
            "CONFIRMED",
            "PENDING_SYNC",
            "RESCHEDULE_REQUESTED",
          ],
        },
      },
      select: {
        id: true,
        reference: true,
        startAt: true,
        endAt: true,
        modality: true,
        status: true,
        practiceArea: { select: { name: true } },
        lawyer: { select: { displayName: true } },
      },
      orderBy: { startAt: "asc" },
      take: 10,
    }),
    db.notification.count({ where: { recipientId: actor.id, readAt: null } }),
  ]);

  return {
    matters: matters.map(toMatterSummaryDTO),
    upcomingAppointments: appointments.map((appointment) => ({
      ...appointment,
      startAt: appointment.startAt.toISOString(),
      endAt: appointment.endAt.toISOString(),
    })),
    unreadNotifications,
  };
}

export async function getPortalMatter(actor: PolicyActor, matterId: string) {
  await requireMatterAccess(matterId, actor);
  const internal = canSeeInternalContent(actor);
  const visibilityWhere = internal
    ? undefined
    : { visibility: Visibility.CLIENT };
  const matter = await db.matter.findUnique({
    where: { id: matterId },
    select: {
      id: true,
      reference: true,
      title: true,
      descriptionPublic: true,
      descriptionInternal: internal,
      status: true,
      stage: true,
      nextActionAt: true,
      nextActionPublic: true,
      updatedAt: true,
      assignments: {
        select: {
          role: true,
          lawyer: {
            select: {
              slug: true,
              displayName: true,
              position: true,
              image: true,
            },
          },
        },
      },
      updates: {
        where: visibilityWhere,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          body: true,
          visibility: true,
          createdAt: true,
        },
      },
      documents: {
        where: visibilityWhere,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          originalName: true,
          mimeType: true,
          size: true,
          visibility: true,
          createdAt: true,
        },
      },
      messages: {
        where: visibilityWhere,
        orderBy: { createdAt: "asc" },
        take: 100,
        select: {
          id: true,
          body: true,
          visibility: true,
          createdAt: true,
          sender: { select: { id: true, name: true, role: true } },
        },
      },
    },
  });
  if (!matter) throw new AccessDeniedError();

  return {
    ...toMatterSummaryDTO(matter),
    descriptionPublic: matter.descriptionPublic,
    ...(internal ? { descriptionInternal: matter.descriptionInternal } : {}),
    assignments: matter.assignments,
    updates: matter.updates.map(toVisibleTimelineItem),
    documents: matter.documents.map((document) => ({
      ...document,
      createdAt: document.createdAt.toISOString(),
      downloadUrl: `/api/portal/asuntos/${matter.id}/documentos/${document.id}`,
    })),
    messages: matter.messages.map((message) => ({
      ...message,
      createdAt: message.createdAt.toISOString(),
    })),
  };
}

export async function createPortalMessage(
  actor: PolicyActor,
  matterId: string,
  input: PortalMessageInput,
) {
  await requireMatterAccess(matterId, actor);
  const visibility =
    actor.role === "CLIENT"
      ? Visibility.CLIENT
      : (input.visibility ?? Visibility.CLIENT);
  const message = await db.$transaction(async (transaction) => {
    const created = await transaction.message.create({
      data: {
        matterId,
        senderId: actor.id,
        body: input.body,
        visibility,
      },
      select: { id: true, body: true, visibility: true, createdAt: true },
    });
    await transaction.auditLog.create({
      data: {
        actorId: actor.id,
        action: "MATTER_MESSAGE_CREATED",
        entityType: "Message",
        entityId: created.id,
        metadata: { matterId, visibility },
      },
    });
    return created;
  });
  return { ...message, createdAt: message.createdAt.toISOString() };
}
