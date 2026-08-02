import { describe, expect, it } from "vitest";

import { S3PrivateStorageProvider } from "@/lib/storage/s3";

describe("almacenamiento S3 compatible", () => {
  it("genera una URL GET firmada de corta duración sin exponer la clave secreta", async () => {
    const storage = new S3PrivateStorageProvider({
      endpoint: "https://storage.example.com",
      region: "us-east-1",
      bucket: "xs-private",
      accessKeyId: "ACCESS_TEST",
      secretAccessKey: "SECRET_TEST",
    });
    const signed = await storage.createSignedDownloadUrl(
      "ab/abcdef",
      "informe demo.pdf",
      300,
    );
    const url = new URL(signed);
    expect(url.pathname).toBe("/xs-private/ab/abcdef");
    expect(url.searchParams.get("X-Amz-Algorithm")).toBe("AWS4-HMAC-SHA256");
    expect(url.searchParams.get("X-Amz-Expires")).toBe("300");
    expect(url.searchParams.get("X-Amz-Signature")).toMatch(/^[a-f0-9]{64}$/);
    expect(signed).not.toContain("SECRET_TEST");
  });
});
