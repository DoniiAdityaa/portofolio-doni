import type { ContentTable } from "@/lib/actions/content-rows";

/** Shown next to each item in the trash and on the Overview. */
export const CONTENT_KIND_LABELS: Record<ContentTable, string> = {
  skills: "Skill",
  experiences: "Career",
  educations: "Education",
  achievements: "Achievement",
  projects: "Project",
};
