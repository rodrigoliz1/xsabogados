import { NextResponse } from "next/server";

const MAX_PUBLIC_JSON_BYTES = 32 * 1024;

export type PublicApiResponse = {
  ok: boolean;
  reference?: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export function ensureSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return;
  const originUrl = new URL(origin);
  const requestUrl = new URL(request.url);
  const forwardedHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (originUrl.host !== (forwardedHost ?? requestUrl.host)) {
    throw new RequestSecurityError("Origen no permitido.", 403);
  }
}

export async function readPublicJson(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new RequestSecurityError(
      "El contenido debe enviarse como JSON.",
      415,
    );
  }
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_PUBLIC_JSON_BYTES) {
    throw new RequestSecurityError("La solicitud es demasiado grande.", 413);
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_PUBLIC_JSON_BYTES) {
    throw new RequestSecurityError("La solicitud es demasiado grande.", 413);
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new RequestSecurityError(
      "El cuerpo de la solicitud no es JSON válido.",
      400,
    );
  }
}

export class RequestSecurityError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export function publicApiResponse(body: PublicApiResponse, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

export function isHoneypotTriggered(value?: string) {
  return Boolean(value?.trim());
}
