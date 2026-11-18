import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MEDIA_BUCKET } from "@/lib/supabase/storage";

/**
 * Deletes replaced or removed files. Failures are only logged: a leftover file is
 * harmless, while failing the save the owner just made is not.
 */
export async function removeMediaFiles(
  paths: (string | null | undefined)[],
  bucket: string = MEDIA_BUCKET,
) {
  const existing = paths.filter((path): path is string => Boolean(path));
  if (existing.length === 0) return;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage.from(bucket).remove(existing);
  if (error) console.error("[storage] Could not remove files", error);
}
