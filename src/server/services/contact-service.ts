import { Prisma } from "@prisma/client";

import { trackServerEvent } from "@/lib/analytics";
import { db } from "@/lib/db";
import { escapeEmailHtml, sendTrackedEmail } from "@/lib/email";
import { createPublicReference } from "@/lib/security/tokens";
import type { ContactInput } from "@/lib/validation";
import {
  createDevelopmentContact,
  developmentMemoryEnabled,
} from "@/server/services/dev-memory";

export async function createContactSubmission(input: ContactInput) {
  if (developmentMemoryEnabled()) {
    const result = createDevelopmentContact(input);
    trackServerEvent("submit_contact", {
      hasPracticeArea: Boolean(input.practiceArea),
      provider: "development-memory",
    });
    return result;
  }
  const reference = createPublicReference("CONTACTO");
  const submission = await db.contactSubmission.create({
    data: {
      reference,
      name: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company,
      practiceArea: input.practiceArea,
      message: input.message,
      privacyAcceptedAt: new Date(),
    },
    select: { id: true },
  });
  await db.auditLog.create({
    data: {
      action: "CONTACT_SUBMISSION_CREATED",
      entityType: "ContactSubmission",
      entityId: submission.id,
      metadata: { reference } as Prisma.InputJsonValue,
    },
  });

  const recipient =
    process.env.CONTACT_RECIPIENT_EMAIL ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    "contacto@xs-abogados.com";
  const officeText = [
    `Nueva solicitud ${reference}`,
    `Nombre: ${input.name}`,
    `Correo: ${input.email}`,
    `Teléfono: ${input.phone}`,
    input.company ? `Empresa: ${input.company}` : "",
    input.practiceArea ? `Área: ${input.practiceArea}` : "",
    `Mensaje: ${input.message}`,
  ]
    .filter(Boolean)
    .join("\n");

  await Promise.allSettled([
    sendTrackedEmail({
      to: recipient,
      subject: `Nueva solicitud de contacto ${reference}`,
      template: "contact-office-notification",
      text: officeText,
      html: `<h1>Nueva solicitud ${escapeEmailHtml(reference)}</h1><pre>${escapeEmailHtml(
        officeText,
      )}</pre>`,
      metadata: { "X-XS-Reference": reference },
    }),
    sendTrackedEmail({
      to: input.email,
      subject: `Recibimos tu mensaje · ${reference}`,
      template: "contact-receipt",
      text: `Recibimos tu mensaje con la referencia ${reference}. El envío no crea una relación abogado-cliente ni sustituye una consulta jurídica.`,
      html: `<p>Hola ${escapeEmailHtml(
        input.name,
      )},</p><p>Recibimos tu mensaje con la referencia <strong>${escapeEmailHtml(
        reference,
      )}</strong>.</p><p>El envío no crea una relación abogado-cliente ni sustituye una consulta jurídica.</p>`,
      metadata: { "X-XS-Reference": reference },
    }),
  ]);
  trackServerEvent("submit_contact", {
    hasPracticeArea: Boolean(input.practiceArea),
  });
  return { reference };
}
