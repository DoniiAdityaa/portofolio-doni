import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Stored CV paths per language; `null` when not uploaded. */
export async function getCvPaths(): Promise<{ en: string | null; id: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("cv_en_path, cv_id_path")
    .maybeSingle();
  if (error) throw error;
  return { en: data?.cv_en_path ?? null, id: data?.cv_id_path ?? null };
}
