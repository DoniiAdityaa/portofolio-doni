"use server";

import { updateTag } from "next/cache";
import { z } from "zod";

import { runAdminAction } from "@/lib/actions/admin-action";
import {
  archiveRow,
  reorderSchema,
  rowIdSchema,
  rowStatusSchema,
  saveOrder,
  setRowStatus,
} from "@/lib/actions/content-rows";
import { type ActionResult, fail, ok } from "@/lib/actions/result";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { getIconPreview, type IconPreview, searchIcons } from "./icon-preview";
import { skillCategoryFormSchema, skillFormSchema } from "./schema";

/** Postgres: a row is still referenced by a foreign key. */
const FOREIGN_KEY_VIOLATION = "23503";

function expireSkills() {
  updateTag(CACHE_TAGS.skills);
}

export async function saveSkill(input: unknown): Promise<ActionResult> {
  return runAdminAction(skillFormSchema, input, async ({ id, iconSlug, categoryId, ...rest }) => {
    if (!getIconPreview(iconSlug)) {
      return fail(`No icon has the slug "${iconSlug}". Pick one of the suggestions.`);
    }

    const supabase = await createSupabaseServerClient();
    const values = { ...rest, icon_slug: iconSlug, category_id: categoryId };
    const { error } = id
      ? await supabase.from("skills").update(values).eq("id", id)
      : await supabase.from("skills").insert(values);
    if (error) throw error;

    expireSkills();
    return ok();
  });
}

export async function setSkillStatus(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowStatusSchema, input, async ({ id, status }) => {
    await setRowStatus("skills", id, status);
    expireSkills();
    return ok();
  });
}

export async function archiveSkill(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowIdSchema, input, async ({ id }) => {
    await archiveRow("skills", id);
    expireSkills();
    return ok();
  });
}

export async function reorderSkills(input: unknown): Promise<ActionResult> {
  return runAdminAction(reorderSchema, input, async ({ ids }) => {
    await saveOrder("skills", ids);
    expireSkills();
    return ok();
  });
}

/**
 * Icon lookup for the skill form: the exact match (if any) plus suggestions, so the
 * owner can find a slug by name. Keeps the Simple Icons set off the client.
 */
export async function lookupSkillIcon(
  input: unknown,
): Promise<ActionResult<{ match: IconPreview | null; suggestions: IconPreview[] }>> {
  return runAdminAction(z.object({ query: z.string().max(60) }), input, async ({ query }) => {
    const slug = query.trim().toLowerCase();
    return ok({ match: getIconPreview(slug), suggestions: searchIcons(query) });
  });
}

export async function saveSkillCategory(input: unknown): Promise<ActionResult> {
  return runAdminAction(skillCategoryFormSchema, input, async ({ id, name }) => {
    const supabase = await createSupabaseServerClient();

    if (id) {
      const { error } = await supabase.from("skill_categories").update({ name }).eq("id", id);
      if (error) throw error;
    } else {
      // New categories go to the end of the list.
      const { count, error: countError } = await supabase
        .from("skill_categories")
        .select("id", { count: "exact", head: true });
      if (countError) throw countError;
      const { error } = await supabase
        .from("skill_categories")
        .insert({ name, sort_order: (count ?? 0) + 1 });
      if (error) throw error;
    }

    expireSkills();
    return ok();
  });
}

export async function deleteSkillCategory(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowIdSchema, input, async ({ id }) => {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("skill_categories").delete().eq("id", id);
    if (error?.code === FOREIGN_KEY_VIOLATION) {
      return fail(
        "This category still has skills (including archived ones in Trash). Move them first.",
      );
    }
    if (error) throw error;

    expireSkills();
    return ok();
  });
}

export async function reorderSkillCategories(input: unknown): Promise<ActionResult> {
  return runAdminAction(reorderSchema, input, async ({ ids }) => {
    await saveOrder("skill_categories", ids);
    expireSkills();
    return ok();
  });
}
