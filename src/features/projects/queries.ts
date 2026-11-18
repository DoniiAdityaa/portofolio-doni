// Features may use each other's public queries and types, never their components or dummy data.
import { getSkillsByIds } from "@/features/skills/queries";
import type { Skill } from "@/features/skills/types";
import { compareByManualOrderThenDate, isPubliclyVisible } from "@/lib/content/visibility";

import { FEATURED_PROJECTS_LIMIT } from "./constants";
import { dummyProjectCategories, dummyProjects, dummyProjectTypes } from "./dummy";
import type { Project, ProjectCategory, ProjectType } from "./types";

/** A project with its category and tech stack resolved, ready for cards and pages. */
export type ProjectWithRelations = Project & {
  type: ProjectType | null;
  category: ProjectCategory | null;
  techStack: Skill[];
};

const byOrderThenStartDate = compareByManualOrderThenDate<Project>((project) => project.startedAt);

async function withRelations(project: Project): Promise<ProjectWithRelations> {
  return {
    ...project,
    type: dummyProjectTypes.find((type) => type.id === project.typeId) ?? null,
    category: dummyProjectCategories.find((category) => category.id === project.categoryId) ?? null,
    techStack: await getSkillsByIds(project.skillIds),
  };
}

/** All published projects, manual order first, then newest first (Case 01 §5.4). */
export async function getPublishedProjects(): Promise<ProjectWithRelations[]> {
  const projects = dummyProjects.filter(isPubliclyVisible).sort(byOrderThenStartDate);
  return Promise.all(projects.map(withRelations));
}

/** Types that have at least one published project, in manual order. */
export async function getUsedProjectTypes(): Promise<ProjectType[]> {
  const used = new Set(dummyProjects.filter(isPubliclyVisible).map((p) => p.typeId));
  return dummyProjectTypes.filter((type) => used.has(type.id)).sort(bySortOrder);
}

/** Categories that have at least one published project, in manual order. */
export async function getUsedProjectCategories(): Promise<ProjectCategory[]> {
  const used = new Set(dummyProjects.filter(isPubliclyVisible).map((p) => p.categoryId));
  return dummyProjectCategories.filter((category) => used.has(category.id)).sort(bySortOrder);
}

const bySortOrder = (a: { sortOrder: number }, b: { sortOrder: number }) =>
  a.sortOrder - b.sortOrder;

/** Published featured projects for Home, at most FEATURED_PROJECTS_LIMIT. */
export async function getFeaturedProjects(): Promise<ProjectWithRelations[]> {
  const featured = dummyProjects
    .filter((project) => project.isFeatured && isPubliclyVisible(project))
    .sort(byOrderThenStartDate)
    .slice(0, FEATURED_PROJECTS_LIMIT);

  return Promise.all(featured.map(withRelations));
}

/** One published project by slug, or `null` (the page then returns 404). */
export async function getProjectBySlug(slug: string): Promise<ProjectWithRelations | null> {
  const project = dummyProjects.find((item) => item.slug === slug && isPubliclyVisible(item));
  return project ? withRelations(project) : null;
}

/** Slugs of all published projects, for static generation. */
export async function getPublishedProjectSlugs(): Promise<string[]> {
  return dummyProjects.filter(isPubliclyVisible).map((project) => project.slug);
}
