"use server";

import { updateTag } from "next/cache";
import { z } from "zod";

import { runAdminAction } from "@/lib/actions/admin-action";
import { type ContentTable, restoreRow } from "@/lib/actions/content-rows";
import { type ActionResult, ok } from "@/lib/actions/result";
import { removeMediaFiles } from "@/lib/actions/storage";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const TABLE_TAGS: Record<ContentTable, string> = {
  skills: CACHE_TAGS.skills,
  experiences: CACHE_TAGS.career,
  educations: CACHE_TAGS.education,
  achievements: CACHE_TAGS.achievements,
  projects: CACHE_TAGS.projects,
};

const trashItemSchema = z.object({
  table: z.enum(["skills", "experiences", "educations", "achievements", "projects"]),
  id: z.uuid(),
});

export async function restoreTrashItem(input: unknown): Promise<ActionResult> {
  return runAdminAction(trashItemSchema, input, async ({ table, id }) => {
    await restoreRow(table, id);
    updateTag(TABLE_TAGS[table]);
    return ok();
  });
}

/** Deletes an archived row for good, together with its uploaded files (Case 01 §6). */
export async function deleteTrashItem(input: unknown): Promise<ActionResult> {
  return runAdminAction(trashItemSchema, input, async ({ table, id }) => {
    const files = await getFiles(table, id);

    const supabase = await createSupabaseServerClient();
    // Only rows that are already in the trash can be deleted permanently.
    const { error } = await supabase
      .from(table as "skills")
      .delete()
      .eq("id", id)
      .not("deleted_at", "is", null);
    if (error) throw error;

    await removeMediaFiles(files);
    updateTag(TABLE_TAGS[table]);
    return ok();
  });
}

/** Storage paths owned by a row, removed with it. */
async function getFiles(table: ContentTable, id: string): Promise<(string | null)[]> {
  const supabase = await createSupabaseServerClient();

  switch (table) {
    case "skills":
      return [];
    case "experiences":
    case "educations": {
      const { data, error } = await supabase
        .from(table as "experiences")
        .select("logo_path")
        .eq("id", id)
        .single();
      if (error) throw error;
      return [data.logo_path];
    }
    case "achievements": {
      const { data, error } = await supabase
        .from("achievements")
        .select("image_path")
        .eq("id", id)
        .single();
      if (error) throw error;
      return [data.image_path];
    }
    case "projects": {
      const { data, error } = await supabase
        .from("projects")
        .select("thumbnail_path, project_images(path)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return [data.thumbnail_path, ...data.project_images.map((image) => image.path)];
    }
  }
}
