import { createSupabaseBrowserClient } from "./browser";
import { DOCUMENT_RULES, DOCUMENTS_BUCKET, MEDIA_BUCKET, MEDIA_RULES } from "./storage";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Uploads one image to the media bucket from the browser (admin only, enforced by RLS).
 * Type and size are checked first for quick feedback; the bucket enforces them too.
 */
export async function uploadMediaFile(
  file: File,
  folder: string,
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const extension = EXTENSIONS[file.type];
  if (!extension) return { ok: false, error: `${file.name}: use a JPG, PNG, or WebP image.` };
  if (file.size > MEDIA_RULES.maxBytes) {
    return { ok: false, error: `${file.name}: the image must be 5 MB or smaller.` };
  }

  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await createSupabaseBrowserClient()
    .storage.from(MEDIA_BUCKET)
    .upload(path, file, { contentType: file.type });

  return error ? { ok: false, error: `${file.name}: upload failed.` } : { ok: true, path };
}

/** Uploads one PDF (a CV) to the documents bucket from the browser. */
export async function uploadDocumentFile(
  file: File,
  folder: string,
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  if (!(DOCUMENT_RULES.mimeTypes as readonly string[]).includes(file.type)) {
    return { ok: false, error: `${file.name}: upload a PDF.` };
  }
  if (file.size > DOCUMENT_RULES.maxBytes) {
    return { ok: false, error: `${file.name}: the PDF must be 10 MB or smaller.` };
  }

  const path = `${folder}/${crypto.randomUUID()}.pdf`;
  const { error } = await createSupabaseBrowserClient()
    .storage.from(DOCUMENTS_BUCKET)
    .upload(path, file, { contentType: file.type });

  return error ? { ok: false, error: `${file.name}: upload failed.` } : { ok: true, path };
}
