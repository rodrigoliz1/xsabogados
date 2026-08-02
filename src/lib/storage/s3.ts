import { createHash, createHmac, randomBytes } from "node:crypto";

import type {
  AllowedPrivateDocumentType,
  PrivateStorageProvider,
} from "@/lib/storage/types";

type S3Config = {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
};

function sha256(value: Uint8Array | string) {
  return createHash("sha256").update(value).digest("hex");
}

function hmac(key: Uint8Array | string, value: string) {
  return createHmac("sha256", key).update(value).digest();
}

function encodeAws(value: string) {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function encodePath(value: string) {
  return value.split("/").map(encodeAws).join("/");
}

function awsTimestamp(date: Date) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

export class S3PrivateStorageProvider implements PrivateStorageProvider {
  readonly name = "s3" as const;

  constructor(private readonly config: S3Config) {}

  private objectUrl(key: string) {
    const endpoint = this.config.endpoint.replace(/\/$/, "");
    return new URL(
      `${endpoint}/${encodePath(this.config.bucket)}/${encodePath(key)}`,
    );
  }

  private signingKey(dateStamp: string) {
    const dateKey = hmac(`AWS4${this.config.secretAccessKey}`, dateStamp);
    const regionKey = hmac(dateKey, this.config.region);
    const serviceKey = hmac(regionKey, "s3");
    return hmac(serviceKey, "aws4_request");
  }

  private async signedRequest(
    method: "GET" | "PUT" | "DELETE",
    key: string,
    body?: Uint8Array,
    extraHeaders: Record<string, string> = {},
  ) {
    const url = this.objectUrl(key);
    const now = new Date();
    const amzDate = awsTimestamp(now);
    const dateStamp = amzDate.slice(0, 8);
    const payloadHash = sha256(body ?? new Uint8Array());
    const canonicalHeaders = `host:${url.host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
    const canonicalRequest = [
      method,
      url.pathname,
      "",
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join("\n");
    const scope = `${dateStamp}/${this.config.region}/s3/aws4_request`;
    const stringToSign = [
      "AWS4-HMAC-SHA256",
      amzDate,
      scope,
      sha256(canonicalRequest),
    ].join("\n");
    const signature = createHmac("sha256", this.signingKey(dateStamp))
      .update(stringToSign)
      .digest("hex");
    const authorization = `AWS4-HMAC-SHA256 Credential=${this.config.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return fetch(url, {
      method,
      headers: {
        authorization,
        "x-amz-content-sha256": payloadHash,
        "x-amz-date": amzDate,
        ...extraHeaders,
      },
      body: body ? Buffer.from(body) : undefined,
      cache: "no-store",
    });
  }

  async put(input: {
    bytes: Uint8Array;
    mimeType: AllowedPrivateDocumentType;
  }) {
    const id = randomBytes(16).toString("hex");
    const key = `${id.slice(0, 2)}/${id}`;
    const response = await this.signedRequest("PUT", key, input.bytes, {
      "content-type": input.mimeType,
      "content-disposition": "attachment",
    });
    if (!response.ok)
      throw new Error(`S3 rechazó la carga privada (${response.status}).`);
    return { key, size: input.bytes.byteLength, mimeType: input.mimeType };
  }

  async get(key: string) {
    const response = await this.signedRequest("GET", key);
    if (!response.ok)
      throw new Error(`S3 rechazó la descarga privada (${response.status}).`);
    return new Uint8Array(await response.arrayBuffer());
  }

  async delete(key: string) {
    const response = await this.signedRequest("DELETE", key);
    if (!response.ok && response.status !== 404) {
      throw new Error(
        `S3 rechazó la eliminación privada (${response.status}).`,
      );
    }
  }

  async createSignedDownloadUrl(
    key: string,
    filename: string,
    expiresInSeconds = 300,
  ) {
    const url = this.objectUrl(key);
    const now = new Date();
    const amzDate = awsTimestamp(now);
    const dateStamp = amzDate.slice(0, 8);
    const scope = `${dateStamp}/${this.config.region}/s3/aws4_request`;
    const expires = Math.max(60, Math.min(900, Math.floor(expiresInSeconds)));
    const queryEntries: Array<[string, string]> = [
      ["X-Amz-Algorithm", "AWS4-HMAC-SHA256"],
      ["X-Amz-Credential", `${this.config.accessKeyId}/${scope}`],
      ["X-Amz-Date", amzDate],
      ["X-Amz-Expires", expires.toString()],
      ["X-Amz-SignedHeaders", "host"],
      [
        "response-content-disposition",
        `attachment; filename="${filename.replace(/["\r\n]/g, "_")}"`,
      ],
    ];
    const canonicalQuery = queryEntries
      .map(([name, value]) => [encodeAws(name), encodeAws(value)] as const)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([name, value]) => `${name}=${value}`)
      .join("&");
    const canonicalRequest = [
      "GET",
      url.pathname,
      canonicalQuery,
      `host:${url.host}\n`,
      "host",
      "UNSIGNED-PAYLOAD",
    ].join("\n");
    const stringToSign = [
      "AWS4-HMAC-SHA256",
      amzDate,
      scope,
      sha256(canonicalRequest),
    ].join("\n");
    const signature = createHmac("sha256", this.signingKey(dateStamp))
      .update(stringToSign)
      .digest("hex");
    url.search = `${canonicalQuery}&X-Amz-Signature=${signature}`;
    return url.toString();
  }
}
