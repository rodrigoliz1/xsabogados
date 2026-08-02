import { NextResponse } from "next/server";

import { enforceRateLimit, RateLimitError } from "@/lib/security/rate-limit";
import {
  ensureSameOrigin,
  readPublicJson,
  RequestSecurityError,
} from "@/lib/security/request";
import { portalMessageSchema } from "@/lib/validation";
import { requireActor } from "@/server/policies";
import { ServiceError } from "@/server/services/errors";
import { createPortalMessage } from "@/server/services/portal-service";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ matterId: string }> },
) {
  try {
    ensureSameOrigin(request);
    const [{ matterId }, actor, body] = await Promise.all([
      context.params,
      requireActor(),
      readPublicJson(request),
    ]);
    const parsed = portalMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "El mensaje no es válido.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400, headers: { "cache-control": "private, no-store" } },
      );
    }
    await enforceRateLimit({
      request,
      scope: "portal-message",
      limit: 30,
      windowMs: 10 * 60 * 1000,
      secondaryKey: actor.id,
    });
    const message = await createPortalMessage(actor, matterId, parsed.data);
    return NextResponse.json(
      { ok: true, message: "Mensaje enviado.", data: message },
      { status: 201, headers: { "cache-control": "private, no-store" } },
    );
  } catch (error) {
    const status =
      error instanceof RateLimitError
        ? 429
        : error instanceof RequestSecurityError || error instanceof ServiceError
          ? error.status
          : 500;
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error && status !== 500
            ? error.message
            : "No fue posible enviar el mensaje.",
      },
      { status, headers: { "cache-control": "private, no-store" } },
    );
  }
}
