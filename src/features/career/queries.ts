import { cacheLife, cacheTag } from "next/cache";

import { getSkillsByIds } from "@/features/skills/queries";
import type { Skill } from "@/features/skills/types";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { storedText } from "@/lib/content/stored";
import { createSupabasePublicClient } from "@/lib/supabase/public";

import type { Experience } from "./types";

export type ExperienceWithSkills = Experience & { techStack: Skill[] };

/** Published career entries, newest first unless reordered in admin. Cached until edited. */
async function loadExperiences(): Promise<Experience[]> {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.career);

  const { data, error } = await createSupabasePublicClient()
    .from("experiences")
    .select("*, experience_skills(skill_id)")
    .order("sort_order", { nullsFirst: false })
    .order("start_date", { ascending: false });
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    status: row.status,
    sortOrder: row.sort_order,
    deletedAt: row.deleted_at,
    company: row.company,
    logoPath: row.logo_path,
    position: storedText(row.position),
    type: row.type,
    startDate: row.start_date,
    endDate: row.end_date,
    responsibilities: storedText(row.responsibilities),
    learnings: storedText(row.learnings),
    impact: storedText(row.impact),
    skillIds: row.experience_skills.map((link) => link.skill_id),
  }));
}

/** Published career entries with their tech stack (Case 01 §5.2). */
export async function getPublishedExperiences(): Promise<ExperienceWithSkills[]> {
  const experiences = await loadExperiences();
  return Promise.all(
    experiences.map(async (item) => ({ ...item, techStack: await getSkillsByIds(item.skillIds) })),
  );
}
