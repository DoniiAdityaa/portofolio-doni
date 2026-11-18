import type { ContentRow } from "@/lib/content/types";
import type { LocalizedText } from "@/lib/i18n/localize";

export type ProjectStatus = "completed" | "in_progress" | "archived";

export type ImageOrientation = "portrait" | "landscape";

/** `project_images` row: one gallery screenshot (Case 02 §7.2). */
export type ProjectImage = {
  id: string;
  path: string | null;
  alt: LocalizedText;
  orientation: ImageOrientation;
  sortOrder: number;
};

/** `project_types` row: the platform, e.g. Mobile, Web (CR-06). Managed in admin. */
export type ProjectType = {
  id: string;
  name: LocalizedText;
  sortOrder: number;
};

/** `project_categories` row: the context, e.g. Personal, Internship, Freelance (CR-06). */
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
  typeId: string;
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
  /** Case-study sections in Markdown (Case 01 §5.4). Empty sections are hidden. */
  overview: LocalizedText;
  problem: LocalizedText;
  solution: LocalizedText;
  features: LocalizedText;
  challenges: LocalizedText;
  images: ProjectImage[];
};
