import { clientEnv } from "@/lib/config/client";

/** Storage buckets (Case 02 §9). */
export const MEDIA_BUCKET = "media";
export const DOCUMENTS_BUCKET = "documents";

/** Upload rules for the media bucket; the bucket enforces the same limits. */
export const MEDIA_RULES = {
  maxBytes: 5 * 1024 * 1024,
  mimeTypes: ["image/jpeg", "image/png", "image/webp"],
} as const;

/** Upload rules for the documents bucket (CVs). */
export const DOCUMENT_RULES = {
  maxBytes: 10 * 1024 * 1024,
  mimeTypes: ["application/pdf"],
} as const;

/** Public URL of a file in a public bucket, e.g. a logo path stored in the database. */
export function publicFileUrl(path: string, bucket: string = MEDIA_BUCKET): string | null {
  const base = clientEnv.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${base}/storage/v1/object/public/${bucket}/${encodedPath}`;
}
