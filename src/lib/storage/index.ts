import "server-only";

import path from "node:path";

import { LocalPrivateStorageProvider } from "@/lib/storage/local";
import { S3PrivateStorageProvider } from "@/lib/storage/s3";
import {
  ALLOWED_PRIVATE_DOCUMENT_TYPES,
  type AllowedPrivateDocumentType,
} from "@/lib/storage/types";

export * from "./types";

const MAX_PRIVATE_FILE_SIZE = 10 * 1024 * 1024;

export function validatePrivateUpload(input: {
  bytes: Uint8Array;
  declaredMimeType: string;
}) {
  if (
    input.bytes.byteLength === 0 ||
    input.bytes.byteLength > MAX_PRIVATE_FILE_SIZE
  ) {
    throw new Error("El archivo debe pesar entre 1 byte y 10 MB.");
  }
  if (
    !ALLOWED_PRIVATE_DOCUMENT_TYPES.includes(
      input.declaredMimeType as AllowedPrivateDocumentType,
    )
  ) {
    throw new Error("El formato del archivo no está permitido.");
  }

  const bytes = input.bytes;
  const isPdf =
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46;
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;
  const isZip =
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    bytes[2] === 0x03 &&
    bytes[3] === 0x04;
  const signatureMatches =
    (input.declaredMimeType === "application/pdf" && isPdf) ||
    (input.declaredMimeType === "image/jpeg" && isJpeg) ||
    (input.declaredMimeType === "image/png" && isPng) ||
    (input.declaredMimeType.includes("officedocument") && isZip);
  if (!signatureMatches)
    throw new Error("El contenido del archivo no coincide con su formato.");

  return input.declaredMimeType as AllowedPrivateDocumentType;
}

export function getPrivateStorageProvider() {
  const provider = process.env.STORAGE_PROVIDER?.toLowerCase() || "local";
  if (provider === "s3") {
    const endpoint = process.env.S3_ENDPOINT;
    const region = process.env.S3_REGION;
    const bucket = process.env.S3_BUCKET;
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
    if (!endpoint || !region || !bucket || !accessKeyId || !secretAccessKey) {
      throw new Error("La configuración de almacenamiento S3 está incompleta.");
    }
    return new S3PrivateStorageProvider({
      endpoint,
      region,
      bucket,
      accessKeyId,
      secretAccessKey,
    });
  }
  if (provider !== "local") {
    throw new Error(`Proveedor de almacenamiento no soportado: ${provider}`);
  }
  if (
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV !== "preview"
  ) {
    throw new Error("El almacenamiento local no está permitido en producción.");
  }
  const directory =
    process.env.PRIVATE_UPLOAD_DIR ||
    path.join(process.cwd(), ".data", "uploads");
  return new LocalPrivateStorageProvider(directory);
}
