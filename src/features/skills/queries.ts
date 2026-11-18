import { isPubliclyVisible } from "@/lib/content/visibility";

import { dummySkillCategories, dummySkills } from "./dummy";
import type { Skill, SkillGroup } from "./types";

const bySortOrder = (a: { sortOrder: number | null }, b: { sortOrder: number | null }) =>
  (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER);

/** Published skills grouped by category; categories and skills in their manual order. */
export async function getSkillGroups(): Promise<SkillGroup[]> {
  const visible = dummySkills.filter(isPubliclyVisible);

  return [...dummySkillCategories]
    .sort(bySortOrder)
    .map((category) => ({
      category,
      skills: visible.filter((skill) => skill.categoryId === category.id).sort(bySortOrder),
    }))
    .filter((group) => group.skills.length > 0);
}

/** Published skills with the given ids, in the order of `ids` (e.g. a project's tech stack). */
export async function getSkillsByIds(ids: readonly string[]): Promise<Skill[]> {
  const visible = new Map(
    dummySkills.filter(isPubliclyVisible).map((skill) => [skill.id, skill] as const),
  );
  return ids.flatMap((id) => visible.get(id) ?? []);
}
