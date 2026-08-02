import { Visibility } from "@prisma/client";

import { db } from "@/lib/db";
import { getPrivateStorageProvider } from "@/lib/storage";
import {
  canSeeInternalContent,
  requireActor,
  requireMatterAccess,
} from "@/server/policies";
import { ServiceError } from "@/server/services/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeDownloadName(name: string) {
  return name.replace(/[\r\n"\\/]/g, "_").slice(0, 180);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ matterId: string; documentId: string }> },
) {
  try {
    const [{ matterId, documentId }, actor] = await Promise.all([
      context.params,
      requireActor(),
    ]);
    await requireMatterAccess(matterId, actor);
    const document = await db.document.findFirst({
      where: {
        id: documentId,
        matterId,
        scanStatus: "CLEAN",
        ...(canSeeInternalContent(actor)
          ? {}
          : { visibility: Visibility.CLIENT }),
      },
      select: { storageKey: true, originalName: true, mimeType: true },
    });
    if (!document) return new Response("No encontrado", { status: 404 });
    const storage = getPrivateStorageProvider();
    const signedUrl = await storage.createSignedDownloadUrl(
      document.storageKey,
      safeDownloadName(document.originalName),
      300,
    );
    if (signedUrl) {
      return Response.redirect(signedUrl, 307);
    }
    const bytes = await storage.get(document.storageKey);
    return new Response(bytes, {
      headers: {
        "content-type": document.mimeType,
        "content-disposition": `attachment; filename="${safeDownloadName(document.originalName)}"`,
        "cache-control": "private, no-store",
        "x-content-type-options": "nosniff",
        "x-robots-tag": "noindex",
      },
    });
  } catch (error) {
    const status = error instanceof ServiceError ? error.status : 500;
    return new Response(
      status === 404 ? "No encontrado" : "No fue posible descargar el archivo",
      {
        status,
        headers: { "cache-control": "private, no-store" },
      },
    );
  }
}
