import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache/tags";
import { storedText } from "@/lib/content/stored";
import { createSupabasePublicClient } from "@/lib/supabase/public";

import type { Skill, SkillCategory, SkillGroup } from "./types";

/** Categories and published skills, in their manual order. Cached until edited in admin. */
async function loadSkills(): Promise<{ categories: SkillCategory[]; skills: Skill[] }> {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.skills);

  const supabase = createSupabasePublicClient();
  const [categories, skills] = await Promise.all([
    supabase.from("skill_categories").select("id, name, sort_order").order("sort_order"),
    // RLS returns only published, non-archived skills.
    supabase
      .from("skills")
      .select("id, name, icon_slug, category_id, status, sort_order, deleted_at")
      .order("sort_order", { nullsFirst: false })
      .order("name"),
  ]);
  if (categories.error) throw categories.error;
  if (skills.error) throw skills.error;

  return {
    categories: categories.data.map((row) => ({
      id: row.id,
      name: storedText(row.name),
      sortOrder: row.sort_order,
    })),
    skills: skills.data.map((row) => ({
      id: row.id,
      name: row.name,
      iconSlug: row.icon_slug,
      categoryId: row.category_id,
      status: row.status,
      sortOrder: row.sort_order,
      deletedAt: row.deleted_at,
    })),
  };
}

/** Published skills grouped by category; categories and skills in their manual order. */
export async function getSkillGroups(): Promise<SkillGroup[]> {
  const { categories, skills } = await loadSkills();
  return categories
    .map((category) => ({
      category,
      skills: skills.filter((skill) => skill.categoryId === category.id),
    }))
    .filter((group) => group.skills.length > 0);
}

/** Published skills with the given ids, in the order of `ids` (e.g. a project's tech stack). */
export async function getSkillsByIds(ids: readonly string[]): Promise<Skill[]> {
  const { skills } = await loadSkills();
  const byId = new Map(skills.map((skill) => [skill.id, skill] as const));
  return ids.flatMap((id) => byId.get(id) ?? []);
}
