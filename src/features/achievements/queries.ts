import { getSkillsByIds } from "@/features/skills/queries";
import type { Skill } from "@/features/skills/types";
import { compareByManualOrderThenDate, isPubliclyVisible } from "@/lib/content/visibility";

import { dummyAchievementCategories, dummyAchievements } from "./dummy";
import type { Achievement, AchievementCategory } from "./types";

export type AchievementWithRelations = Achievement & {
  category: AchievementCategory | null;
  skills: Skill[];
};

/** Published achievements, newest first unless reordered in admin (Case 01 §5.3). */
export async function getPublishedAchievements(): Promise<AchievementWithRelations[]> {
  const achievements = dummyAchievements
    .filter(isPubliclyVisible)
    .sort(compareByManualOrderThenDate<Achievement>((item) => item.issuedAt));

  return Promise.all(
    achievements.map(async (item) => ({
      ...item,
      category: dummyAchievementCategories.find((c) => c.id === item.categoryId) ?? null,
      skills: await getSkillsByIds(item.skillIds),
    })),
  );
}

/** Categories that have at least one published achievement, in manual order. */
export async function getUsedAchievementCategories(): Promise<AchievementCategory[]> {
  const used = new Set(dummyAchievements.filter(isPubliclyVisible).map((item) => item.categoryId));
  return dummyAchievementCategories
    .filter((category) => used.has(category.id))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
