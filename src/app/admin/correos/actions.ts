"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/lib/db";
import { retryTrackedEmail } from "@/lib/email";
import { requireActor } from "@/server/policies";

const retrySchema = z.object({ outboxId: z.string().cuid() });

export async function retryEmailAction(formData: FormData) {
  const actor = await requireActor(["ADMIN"]);
  const parsed = retrySchema.safeParse({ outboxId: formData.get("outboxId") });
  if (!parsed.success) redirect("/admin/correos?error=invalid");

  try {
    await retryTrackedEmail(parsed.data.outboxId);
    await db.auditLog.create({
      data: {
        actorId: actor.id,
        action: "EMAIL_OUTBOX_RETRIED",
        entityType: "EmailOutbox",
        entityId: parsed.data.outboxId,
      },
    });
  } catch {
    await db.auditLog
      .create({
        data: {
          actorId: actor.id,
          action: "EMAIL_OUTBOX_RETRY_FAILED",
          entityType: "EmailOutbox",
          entityId: parsed.data.outboxId,
        },
      })
      .catch(() => undefined);
    redirect("/admin/correos?error=failed");
  }

  revalidatePath("/admin/correos");
  redirect("/admin/correos?notice=sent");
}
