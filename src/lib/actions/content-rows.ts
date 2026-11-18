import "server-only";

import { z } from "zod";

import type { PublicationStatus } from "@/lib/content/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Tables that follow the Case 02 §7.1 conventions (status, deleted_at, sort_order). */
export type ContentTable = "skills" | "experiences" | "educations" | "achievements" | "projects";

/** Category-like tables: always public, ordered by sort_order. */
export type CategoryTable =
  "skill_categories" | "achievement_categories" | "project_types" | "project_categories";

export const rowIdSchema = z.object({ id: z.uuid() });
export const rowStatusSchema = z.object({
  id: z.uuid(),
  status: z.enum(["draft", "published"]),
});
export const reorderSchema = z.object({ ids: z.array(z.uuid()).max(500) });

// The generated client types each table separately; every table in these unions has the
// columns touched below, so they are written through one representative table type.
type Writable = "skills";

export async function setRowStatus(table: ContentTable, id: string, status: PublicationStatus) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(table as Writable)
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

/** Moves a row to the trash (Case 01: archive first, delete permanently later). */
export async function archiveRow(table: ContentTable, id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(table as Writable)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function restoreRow(table: ContentTable, id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(table as Writable)
    .update({ deleted_at: null })
    .eq("id", id);
  if (error) throw error;
}

/** Saves a manual order: the first id gets sort_order 1. */
export async function saveOrder(table: ContentTable | CategoryTable, ids: string[]) {
  const supabase = await createSupabaseServerClient();
  const results = await Promise.all(
    ids.map((id, index) =>
      supabase
        .from(table as Writable)
        .update({ sort_order: index + 1 })
        .eq("id", id),
    ),
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;
}

/** Clears the manual order, so the default date order applies again. */
export async function clearOrder(table: ContentTable) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(table as Writable)
    .update({ sort_order: null })
    .not("sort_order", "is", null);
  if (error) throw error;
}

/** Replaces the skill links of one row, e.g. experience_skills for an experience. */
export async function replaceSkillLinks(
  table: "experience_skills" | "achievement_skills" | "project_skills",
  ownerColumn: "experience_id" | "achievement_id" | "project_id",
  ownerId: string,
  skillIds: string[],
) {
  const supabase = await createSupabaseServerClient();
  const links = supabase.from(table as "experience_skills");
  const { error: deleteError } = await links.delete().eq(ownerColumn as "experience_id", ownerId);
  if (deleteError) throw deleteError;
  if (skillIds.length === 0) return;

  const rows = skillIds.map((skillId) => ({ [ownerColumn]: ownerId, skill_id: skillId }));
  const { error } = await supabase
    .from(table as "experience_skills")
    .insert(rows as { experience_id: string; skill_id: string }[]);
  if (error) throw error;
}
