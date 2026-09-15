import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

function isConfigured(): boolean {
  return Boolean(
    process.env.ARVAN_ENDPOINT && process.env.ARVAN_BUCKET && process.env.ARVAN_ACCESS_KEY && process.env.ARVAN_SECRET_KEY
  );
}

let client: S3Client | null = null;

function getClient(): S3Client {
  if (client) return client;
  client = new S3Client({
    region: "default",
    endpoint: process.env.ARVAN_ENDPOINT,
    credentials: {
      accessKeyId: process.env.ARVAN_ACCESS_KEY ?? "",
      secretAccessKey: process.env.ARVAN_SECRET_KEY ?? "",
    },
  });
  return client;
}

function ensureProtocol(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function publicUrl(key: string): string {
  const base = process.env.ARVAN_PUBLIC_URL_BASE;
  if (base) return `${ensureProtocol(base).replace(/\/$/, "")}/${key}`;

  const bucket = process.env.ARVAN_BUCKET ?? "";
  const host = (process.env.ARVAN_ENDPOINT ?? "").replace(/^https?:\/\//, "");
  return `https://${bucket}.${host}/${key}`;
}

export type UploadResult = { url: string; key: string };

export async function uploadToArvan(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<UploadResult> {
  if (!isConfigured()) {
    throw new Error(
      "Object Storage       ARVAN_ENDPOINT ARVAN_BUCKET ARVAN_ACCESS_KEY  ARVAN_SECRET_KEY   .env   (  README.md)."
    );
  }

  await getClient().send(
    new PutObjectCommand({
      Bucket: process.env.ARVAN_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read",
    })
  );

  return { url: publicUrl(key), key };
}

export async function deleteFromArvan(key: string): Promise<void> {
  if (!isConfigured()) return;
  await getClient().send(new DeleteObjectCommand({ Bucket: process.env.ARVAN_BUCKET, Key: key }));
}

export function keyFromUrl(url: string): string | null {
  try {
    const { pathname } = new URL(url);
    return pathname.replace(/^\//, "") || null;
  } catch {
    return null;
  }
}
