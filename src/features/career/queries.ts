import { getSkillsByIds } from "@/features/skills/queries";
import type { Skill } from "@/features/skills/types";
import { compareByManualOrderThenDate, isPubliclyVisible } from "@/lib/content/visibility";

import { dummyExperiences } from "./dummy";
import type { Experience } from "./types";

export type ExperienceWithSkills = Experience & { techStack: Skill[] };

/** Published career entries, newest first unless reordered in admin (Case 01 §5.2). */
export async function getPublishedExperiences(): Promise<ExperienceWithSkills[]> {
  const experiences = dummyExperiences
    .filter(isPubliclyVisible)
    .sort(compareByManualOrderThenDate<Experience>((item) => item.startDate));

  return Promise.all(
    experiences.map(async (item) => ({ ...item, techStack: await getSkillsByIds(item.skillIds) })),
  );
}
