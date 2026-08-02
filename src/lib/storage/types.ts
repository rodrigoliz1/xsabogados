export const ALLOWED_PRIVATE_DOCUMENT_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
] as const;

export type AllowedPrivateDocumentType =
  (typeof ALLOWED_PRIVATE_DOCUMENT_TYPES)[number];

export type StoredObject = {
  key: string;
  size: number;
  mimeType: AllowedPrivateDocumentType;
};

export interface PrivateStorageProvider {
  readonly name: "local" | "s3";
  put(input: {
    bytes: Uint8Array;
    mimeType: AllowedPrivateDocumentType;
  }): Promise<StoredObject>;
  get(key: string): Promise<Uint8Array>;
  delete(key: string): Promise<void>;
  createSignedDownloadUrl(
    key: string,
    filename: string,
    expiresInSeconds?: number,
  ): Promise<string | null>;
}
