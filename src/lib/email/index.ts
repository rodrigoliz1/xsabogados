import "server-only";

import { EmailDeliveryStatus, Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { MockEmailProvider, ResendEmailProvider } from "@/lib/email/providers";
import type { EmailMessage } from "@/lib/email/types";

export * from "./types";

function getEmailProvider() {
  const provider = process.env.EMAIL_PROVIDER?.toLowerCase() || "mock";
  if (provider === "mock") {
    if (
      process.env.NODE_ENV === "production" &&
      process.env.VERCEL_ENV !== "preview"
    ) {
      throw new Error("EMAIL_PROVIDER=mock no está permitido en producción.");
    }
    return new MockEmailProvider();
  }
  if (provider === "resend") {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !from)
      throw new Error("La configuración de Resend está incompleta.");
    return new ResendEmailProvider(apiKey, from);
  }
  throw new Error(`Proveedor de correo no soportado: ${provider}`);
}

export function escapeEmailHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });
}

export async function sendTrackedEmail(message: EmailMessage) {
  const provider = getEmailProvider();
  const outbox = await db.emailOutbox.create({
    data: {
      recipient: message.to,
      subject: message.subject,
      template: message.template,
      payload: {
        text: message.text,
        html: message.html,
        metadata: message.metadata,
      } as Prisma.InputJsonValue,
      status: EmailDeliveryStatus.PENDING,
    },
  });

  try {
    const result = await provider.send(message);
    await db.emailOutbox.update({
      where: { id: outbox.id },
      data: {
        attempts: { increment: 1 },
        providerId: result.providerId,
        sentAt: new Date(),
        status:
          provider.name === "mock"
            ? EmailDeliveryStatus.MOCKED
            : EmailDeliveryStatus.SENT,
      },
    });
    return result;
  } catch (error) {
    await db.emailOutbox.update({
      where: { id: outbox.id },
      data: {
        attempts: { increment: 1 },
        status: EmailDeliveryStatus.FAILED,
        lastError:
          error instanceof Error
            ? error.message.slice(0, 500)
            : "Error desconocido",
      },
    });
    throw error;
  }
}
