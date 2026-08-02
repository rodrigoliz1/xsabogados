import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { ensureSameOrigin, RequestSecurityError } from "@/lib/security/request";
import {
  getPrivateStorageProvider,
  validatePrivateUpload,
} from "@/lib/storage";
import { documentUploadMetadataSchema } from "@/lib/validation";
import { requireActor, requireMatterAccess } from "@/server/policies";
import { ServiceError } from "@/server/services/errors";

export const runtime = "nodejs";

const MAX_MULTIPART_BYTES = 11 * 1024 * 1024;

export async function POST(
  request: Request,
  context: { params: Promise<{ matterId: string }> },
) {
  let uploadedKey: string | undefined;
  try {
    ensureSameOrigin(request);
    const declaredLength = Number(request.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_MULTIPART_BYTES) {
      return NextResponse.json(
        { ok: false, message: "El archivo supera el límite permitido." },
        { status: 413 },
      );
    }
    const [{ matterId }, actor, formData] = await Promise.all([
      context.params,
      requireActor(["LAWYER", "ADMIN"]),
      request.formData(),
    ]);
    await requireMatterAccess(matterId, actor);
    const metadata = documentUploadMetadataSchema.safeParse({
      title: formData.get("title"),
      visibility: formData.get("visibility") || "CLIENT",
    });
    const file = formData.get("file");
    if (!metadata.success || !(file instanceof File)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Revisa el título, la visibilidad y el archivo.",
          fieldErrors: metadata.success
            ? undefined
            : metadata.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const mimeType = validatePrivateUpload({
      bytes,
      declaredMimeType: file.type,
    });
    const storage = getPrivateStorageProvider();
    const stored = await storage.put({ bytes, mimeType });
    uploadedKey = stored.key;

    const document = await db.$transaction(async (transaction) => {
      const created = await transaction.document.create({
        data: {
          matterId,
          title: metadata.data.title,
          originalName: file.name.replace(/[\r\n\\/]/g, "_").slice(0, 180),
          storageKey: stored.key,
          mimeType: stored.mimeType,
          size: stored.size,
          visibility: metadata.data.visibility,
          scanStatus: "CLEAN",
          uploadedById: actor.id,
        },
        select: {
          id: true,
          title: true,
          originalName: true,
          mimeType: true,
          size: true,
        },
      });
      await transaction.auditLog.create({
        data: {
          actorId: actor.id,
          action: "MATTER_DOCUMENT_UPLOADED",
          entityType: "Document",
          entityId: created.id,
          metadata: {
            matterId,
            visibility: metadata.data.visibility,
            mimeType: stored.mimeType,
          },
        },
      });
      return created;
    });
    return NextResponse.json(
      { ok: true, message: "Documento compartido.", data: document },
      { status: 201, headers: { "cache-control": "private, no-store" } },
    );
  } catch (error) {
    if (uploadedKey) {
      await getPrivateStorageProvider()
        .delete(uploadedKey)
        .catch(() => undefined);
    }
    const status =
      error instanceof RequestSecurityError || error instanceof ServiceError
        ? error.status
        : 500;
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error && status !== 500
            ? error.message
            : "No fue posible guardar el documento.",
      },
      { status, headers: { "cache-control": "private, no-store" } },
    );
  }
}
