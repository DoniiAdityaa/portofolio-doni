"use server";

import { updateTag } from "next/cache";
import { z } from "zod";

import { runAdminAction } from "@/lib/actions/admin-action";
import { type ActionResult, ok } from "@/lib/actions/result";
import { removeMediaFiles } from "@/lib/actions/storage";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DOCUMENTS_BUCKET } from "@/lib/supabase/storage";

const cvFileSchema = z.object({
  locale: z.enum(["en", "id"]),
  // Only files uploaded by the CV page itself are accepted.
  path: z
    .string()
    .regex(/^cv\/[0-9a-f-]+\.pdf$/)
    .nullable(),
});

/** Sets or removes the EN or ID CV (Case 03 M4 #9); the replaced PDF is deleted. */
export async function setCvFile(input: unknown): Promise<ActionResult> {
  return runAdminAction(cvFileSchema, input, async ({ locale, path }) => {
    const supabase = await createSupabaseServerClient();
    const column = locale === "en" ? "cv_en_path" : "cv_id_path";

    const { data: current, error: readError } = await supabase
      .from("site_settings")
      .select("cv_en_path, cv_id_path")
      .single();
    if (readError) throw readError;

    const update = locale === "en" ? { cv_en_path: path } : { cv_id_path: path };
    const { error } = await supabase.from("site_settings").update(update).eq("id", 1);
    if (error) throw error;

    const oldPath = current[column];
    if (oldPath && oldPath !== path) await removeMediaFiles([oldPath], DOCUMENTS_BUCKET);

    updateTag(CACHE_TAGS.settings);
    return ok();
  });
}
