import { TokenType } from "@prisma/client";

import { db } from "@/lib/db";
import { escapeEmailHtml, sendTrackedEmail } from "@/lib/email";
import { hashPassword } from "@/lib/security/passwords";
import { createSecureToken, hashToken } from "@/lib/security/tokens";
import { ServiceError } from "@/server/services/errors";

function demoAccountBlocked(email: string) {
  return (
    email.endsWith("@xs-abogados.local") &&
    (process.env.NODE_ENV === "production" ||
      process.env.ENABLE_DEMO_AUTH === "false")
  );
}

export async function requestPasswordReset(email: string) {
  const user = await db.user.findFirst({
    where: { email, status: "ACTIVE" },
    select: { id: true, name: true, email: true },
  });
  if (!user || demoAccountBlocked(user.email)) return;

  const { token, tokenHash } = createSecureToken();
  await db.actionToken.create({
    data: {
      userId: user.id,
      email: user.email,
      type: TokenType.PASSWORD_RESET,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });
  const resetUrl = new URL(
    "/portal/restablecer",
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  );
  resetUrl.searchParams.set("token", token);
  await sendTrackedEmail({
    to: user.email,
    subject: "Restablece tu acceso a XS ABOGADOS",
    template: "password-reset",
    text: `Solicitaste restablecer tu contraseña. La liga vence en una hora: ${resetUrl.toString()}`,
    html: `<p>Hola ${escapeEmailHtml(
      user.name,
    )},</p><p>Solicitaste restablecer tu contraseña. Esta liga vence en una hora.</p><p><a href="${escapeEmailHtml(
      resetUrl.toString(),
    )}">Restablecer contraseña</a></p>`,
  }).catch(() => undefined);
}

export async function resetPassword(token: string, password: string) {
  const tokenHash = hashToken(token);
  const actionToken = await db.actionToken.findUnique({
    where: { tokenHash },
    select: {
      id: true,
      userId: true,
      email: true,
      type: true,
      expiresAt: true,
      usedAt: true,
    },
  });
  if (
    !actionToken ||
    !actionToken.userId ||
    actionToken.type !== TokenType.PASSWORD_RESET ||
    actionToken.usedAt ||
    actionToken.expiresAt <= new Date() ||
    demoAccountBlocked(actionToken.email)
  ) {
    throw new ServiceError(
      "La liga es inválida o ha vencido.",
      400,
      "INVALID_RESET_TOKEN",
    );
  }
  const userId = actionToken.userId;
  const passwordHash = await hashPassword(password);
  await db.$transaction(async (transaction) => {
    const claimed = await transaction.actionToken.updateMany({
      where: {
        id: actionToken.id,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      data: { usedAt: new Date() },
    });
    if (claimed.count !== 1) {
      throw new ServiceError(
        "La liga es inválida o ha vencido.",
        400,
        "INVALID_RESET_TOKEN",
      );
    }
    await transaction.user.update({
      where: { id: userId },
      data: { passwordHash, sessionVersion: { increment: 1 } },
    });
  });
}
