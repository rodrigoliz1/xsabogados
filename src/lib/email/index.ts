import "server-only";

import { EmailDeliveryStatus, Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import {
  BrevoEmailProvider,
  MockEmailProvider,
  ResendEmailProvider,
} from "@/lib/email/providers";
import type { EmailMessage, EmailProvider } from "@/lib/email/types";
import {
  getBrevoConfiguration,
  getEmailProviderName,
  isMockEmailAllowed,
  type RuntimeEnvironment,
} from "@/lib/environment";

export * from "./types";
export * from "./template";

export function getEmailProvider(
  environment: RuntimeEnvironment = process.env,
): EmailProvider {
  const provider = getEmailProviderName(environment);
  if (provider === "mock") {
    if (!isMockEmailAllowed(environment)) {
      throw new Error("EMAIL_PROVIDER=mock no está permitido en producción.");
    }
    return new MockEmailProvider();
  }
  if (provider === "brevo") {
    const configuration = getBrevoConfiguration(environment);
    return new BrevoEmailProvider(
      configuration.apiKey,
      configuration.fromAddress,
      configuration.fromName,
      {
        replyTo: configuration.replyTo,
        sandboxMode: configuration.sandboxMode,
      },
    );
  }
  if (provider === "resend") {
    const apiKey = environment.RESEND_API_KEY;
    const from = environment.EMAIL_FROM;
    if (!apiKey || !from)
      throw new Error("La configuración de Resend está incompleta.");
    return new ResendEmailProvider(apiKey, from);
  }
  throw new Error(`Proveedor de correo no soportado: ${provider}`);
}

function safeProviderError(provider: EmailProvider) {
  return `El proveedor ${provider.name} no pudo completar el envío.`;
}

async function deliverOutboxMessage(
  outboxId: string,
  message: EmailMessage,
  provider: EmailProvider,
) {
  try {
    const result = await provider.send(message);
    await db.emailOutbox.update({
      where: { id: outboxId },
      data: {
        attempts: { increment: 1 },
        lastAttemptAt: new Date(),
        providerId: result.providerId,
        lastError: null,
        sentAt: new Date(),
        status:
          provider.name === "mock"
            ? EmailDeliveryStatus.MOCKED
            : EmailDeliveryStatus.SENT,
      },
    });
    return result;
  } catch {
    await db.emailOutbox.update({
      where: { id: outboxId },
      data: {
        attempts: { increment: 1 },
        lastAttemptAt: new Date(),
        status: EmailDeliveryStatus.FAILED,
        lastError: safeProviderError(provider),
      },
    });
    throw new Error(safeProviderError(provider));
  }
}

export async function sendTrackedEmail(message: EmailMessage) {
  const recipients = Array.isArray(message.to) ? message.to : [message.to];
  const outbox = await db.emailOutbox.create({
    data: {
      recipient: recipients.join(", "),
      subject: message.subject,
      template: message.template,
      payload: {
        to: recipients,
        text: message.text,
        html: message.html,
        replyTo: message.replyTo,
        tags: message.tags,
        metadata: message.metadata,
      } as Prisma.InputJsonValue,
      status: EmailDeliveryStatus.PENDING,
    },
  });

  try {
    return await deliverOutboxMessage(outbox.id, message, getEmailProvider());
  } catch (error) {
    await db.emailOutbox.updateMany({
      where: { id: outbox.id, status: EmailDeliveryStatus.PENDING },
      data: {
        status: EmailDeliveryStatus.FAILED,
        lastAttemptAt: new Date(),
        lastError: "La configuración del proveedor está incompleta.",
      },
    });
    throw error;
  }
}

function messageFromOutbox(outbox: {
  recipient: string;
  subject: string;
  template: string;
  payload: Prisma.JsonValue;
}): EmailMessage {
  const payload = outbox.payload;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("El correo pendiente no contiene un payload válido.");
  }
  const stored = payload as Record<string, Prisma.JsonValue>;
  const to = Array.isArray(stored.to)
    ? stored.to.filter((item): item is string => typeof item === "string")
    : outbox.recipient
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
  if (
    to.length === 0 ||
    typeof stored.text !== "string" ||
    typeof stored.html !== "string"
  ) {
    throw new Error("El correo pendiente no contiene datos reenviables.");
  }
  const metadata =
    stored.metadata &&
    typeof stored.metadata === "object" &&
    !Array.isArray(stored.metadata)
      ? Object.fromEntries(
          Object.entries(stored.metadata).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string",
          ),
        )
      : undefined;
  const tags = Array.isArray(stored.tags)
    ? stored.tags.filter((item): item is string => typeof item === "string")
    : undefined;
  return {
    to,
    subject: outbox.subject,
    template: outbox.template,
    text: stored.text,
    html: stored.html,
    replyTo: typeof stored.replyTo === "string" ? stored.replyTo : undefined,
    tags,
    metadata,
  };
}

export async function retryTrackedEmail(outboxId: string) {
  const claimed = await db.emailOutbox.updateMany({
    where: { id: outboxId, status: EmailDeliveryStatus.FAILED },
    data: { status: EmailDeliveryStatus.PENDING },
  });
  if (claimed.count !== 1) {
    throw new Error("El correo ya fue reenviado o no está disponible.");
  }

  try {
    const outbox = await db.emailOutbox.findUniqueOrThrow({
      where: { id: outboxId },
      select: {
        recipient: true,
        subject: true,
        template: true,
        payload: true,
      },
    });
    return await deliverOutboxMessage(
      outboxId,
      messageFromOutbox(outbox),
      getEmailProvider(),
    );
  } catch (error) {
    await db.emailOutbox.updateMany({
      where: { id: outboxId, status: EmailDeliveryStatus.PENDING },
      data: {
        status: EmailDeliveryStatus.FAILED,
        lastError: "No fue posible preparar el reenvío transaccional.",
      },
    });
    throw error;
  }
}
