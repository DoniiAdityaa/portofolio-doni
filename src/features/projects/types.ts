import type { ContentRow } from "@/lib/content/types";
import type { LocalizedText } from "@/lib/i18n/localize";

export type ProjectStatus = "completed" | "in_progress" | "archived";

/** `project_categories` row, e.g. Mobile, Web, Backend. */
export type ProjectCategory = {
  id: string;
  name: LocalizedText;
  sortOrder: number;
};

/** `projects` row plus its `project_skills` ids (Case 02 §7.2). */
export type Project = ContentRow & {
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  thumbnailPath: string | null;
  categoryId: string;
  projectStatus: ProjectStatus;
  startedAt: string;
  endedAt: string | null;
  isFeatured: boolean;
  repoUrl: string | null;
  demoUrl: string | null;
  playStoreUrl: string | null;
  appStoreUrl: string | null;
  skillIds: string[];
};
