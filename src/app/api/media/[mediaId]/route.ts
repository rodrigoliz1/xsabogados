import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getPrivateStorageProvider } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ mediaId: string }> },
) {
  const { mediaId } = await context.params;
  const asset = await db.mediaAsset.findFirst({
    where: {
      id: mediaId,
      status: "READY",
      heroArticles: { some: { status: "PUBLISHED" } },
    },
    select: { storageKey: true, mimeType: true, checksum: true },
  });
  if (!asset)
    return NextResponse.json(
      { message: "Imagen no disponible." },
      { status: 404 },
    );
  const bytes = await getPrivateStorageProvider().get(asset.storageKey);
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "content-type": asset.mimeType,
      "cache-control": "public, max-age=86400, stale-while-revalidate=604800",
      etag: `"${asset.checksum}"`,
      "x-content-type-options": "nosniff",
    },
  });
}
