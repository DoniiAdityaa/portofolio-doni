"use server";

import { updateTag } from "next/cache";
import { z } from "zod";

import { runAdminAction } from "@/lib/actions/admin-action";
import { deleteCategoryRow, saveCategoryRow } from "@/lib/actions/category-rows";
import {
  archiveRow,
  clearOrder,
  reorderSchema,
  replaceSkillLinks,
  rowIdSchema,
  rowStatusSchema,
  saveOrder,
  setRowStatus,
} from "@/lib/actions/content-rows";
import { type ActionResult, fail, ok } from "@/lib/actions/result";
import { removeMediaFiles } from "@/lib/actions/storage";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { categoryFormSchema } from "@/lib/content/category-schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { achievementFormSchema } from "./schema";

function expireAchievements() {
  updateTag(CACHE_TAGS.achievements);
}

/** Creates or updates an achievement and its skill links; returns its id. */
export async function saveAchievement(input: unknown): Promise<ActionResult<{ id: string }>> {
  return runAdminAction(achievementFormSchema, input, async (values) => {
    const supabase = await createSupabaseServerClient();
    const row = {
      title: values.title,
      type: values.type,
      image_path: values.imagePath,
      issuer: values.issuer,
      issued_at: values.issuedAt,
      expires_at: values.expiresAt || null,
      credential_url: values.credentialUrl || null,
      credential_id: values.credentialId || null,
      category_id: values.categoryId || null,
      description: values.description,
      status: values.status,
    };

    let id = values.id;
    let oldImage: string | null = null;
    if (id) {
      const { data: current, error: readError } = await supabase
        .from("achievements")
        .select("image_path")
        .eq("id", id)
        .single();
      if (readError) throw readError;
      oldImage = current.image_path;

      const { error } = await supabase.from("achievements").update(row).eq("id", id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from("achievements").insert(row).select("id").single();
      if (error) throw error;
      id = data.id;
    }

    await replaceSkillLinks("achievement_skills", "achievement_id", id, values.skillIds);
    if (oldImage !== values.imagePath) await removeMediaFiles([oldImage]);

    expireAchievements();
    return ok({ id });
  });
}

export async function setAchievementStatus(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowStatusSchema, input, async ({ id, status }) => {
    await setRowStatus("achievements", id, status);
    expireAchievements();
    return ok();
  });
}

export async function archiveAchievement(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowIdSchema, input, async ({ id }) => {
    await archiveRow("achievements", id);
    expireAchievements();
    return ok();
  });
}

export async function reorderAchievements(input: unknown): Promise<ActionResult> {
  return runAdminAction(reorderSchema, input, async ({ ids }) => {
    await saveOrder("achievements", ids);
    expireAchievements();
    return ok();
  });
}

export async function resetAchievementOrder(): Promise<ActionResult> {
  return runAdminAction(z.undefined(), undefined, async () => {
    await clearOrder("achievements");
    expireAchievements();
    return ok();
  });
}

export async function saveAchievementCategory(input: unknown): Promise<ActionResult> {
  return runAdminAction(categoryFormSchema, input, async (values) => {
    await saveCategoryRow("achievement_categories", values);
    expireAchievements();
    return ok();
  });
}

export async function deleteAchievementCategory(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowIdSchema, input, async ({ id }) => {
    const deleted = await deleteCategoryRow("achievement_categories", id);
    if (!deleted) return fail("This category is still in use.");
    expireAchievements();
    return ok();
  });
}

export async function reorderAchievementCategories(input: unknown): Promise<ActionResult> {
  return runAdminAction(reorderSchema, input, async ({ ids }) => {
    await saveOrder("achievement_categories", ids);
    expireAchievements();
    return ok();
  });
}
