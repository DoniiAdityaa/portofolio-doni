import { cacheLife, cacheTag } from "next/cache";

import { getSkillsByIds } from "@/features/skills/queries";
import type { Skill } from "@/features/skills/types";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { storedText } from "@/lib/content/stored";
import { createSupabasePublicClient } from "@/lib/supabase/public";

import type { Achievement, AchievementCategory } from "./types";

export type AchievementWithRelations = Achievement & {
  category: AchievementCategory | null;
  skills: Skill[];
};

/** Categories and published achievements in public order. Cached until edited in admin. */
async function loadAchievements(): Promise<{
  categories: AchievementCategory[];
  achievements: Achievement[];
}> {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.achievements);

  const supabase = createSupabasePublicClient();
  const [categories, achievements] = await Promise.all([
    supabase.from("achievement_categories").select("id, name, sort_order").order("sort_order"),
    supabase
      .from("achievements")
      .select("*, achievement_skills(skill_id)")
      .order("sort_order", { nullsFirst: false })
      .order("issued_at", { ascending: false }),
  ]);
  if (categories.error) throw categories.error;
  if (achievements.error) throw achievements.error;

  return {
    categories: categories.data.map((row) => ({
      id: row.id,
      name: storedText(row.name),
      sortOrder: row.sort_order,
    })),
    achievements: achievements.data.map((row) => ({
      id: row.id,
      status: row.status,
      sortOrder: row.sort_order,
      deletedAt: row.deleted_at,
      title: storedText(row.title),
      type: row.type,
      imagePath: row.image_path,
      issuer: row.issuer,
      issuedAt: row.issued_at,
      expiresAt: row.expires_at,
      credentialUrl: row.credential_url,
      credentialId: row.credential_id,
      categoryId: row.category_id,
      description: storedText(row.description),
      skillIds: row.achievement_skills.map((link) => link.skill_id),
    })),
  };
}

/** Published achievements, newest first unless reordered in admin (Case 01 §5.3). */
export async function getPublishedAchievements(): Promise<AchievementWithRelations[]> {
  const { categories, achievements } = await loadAchievements();
  return Promise.all(
    achievements.map(async (item) => ({
      ...item,
      category: categories.find((category) => category.id === item.categoryId) ?? null,
      skills: await getSkillsByIds(item.skillIds),
    })),
  );
}

/** Categories that have at least one published achievement, in manual order. */
export async function getUsedAchievementCategories(): Promise<AchievementCategory[]> {
  const { categories, achievements } = await loadAchievements();
  const used = new Set(achievements.map((item) => item.categoryId));
  return categories.filter((category) => used.has(category.id));
}
