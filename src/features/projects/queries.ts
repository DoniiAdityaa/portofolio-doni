// Features may use each other's public queries and types, never their components or dummy data.
import { getSkillsByIds } from "@/features/skills/queries";
import type { Skill } from "@/features/skills/types";
import { compareByManualOrderThenDate, isPubliclyVisible } from "@/lib/content/visibility";

import { FEATURED_PROJECTS_LIMIT } from "./constants";
import { dummyProjectCategories, dummyProjects } from "./dummy";
import type { Project, ProjectCategory } from "./types";

/** A project with its category and tech stack resolved, ready for cards and pages. */
export type ProjectWithRelations = Project & {
  category: ProjectCategory | null;
  techStack: Skill[];
};

const byOrderThenStartDate = compareByManualOrderThenDate<Project>((project) => project.startedAt);

async function withRelations(project: Project): Promise<ProjectWithRelations> {
  return {
    ...project,
    category: dummyProjectCategories.find((category) => category.id === project.categoryId) ?? null,
    techStack: await getSkillsByIds(project.skillIds),
  };
}

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
