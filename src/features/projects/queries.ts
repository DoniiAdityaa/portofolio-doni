// Features may use each other's public queries and types, never their components.
import { cacheLife, cacheTag } from "next/cache";

import { getSkillsByIds } from "@/features/skills/queries";
import type { Skill } from "@/features/skills/types";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { storedText } from "@/lib/content/stored";
import { createSupabasePublicClient } from "@/lib/supabase/public";

import { FEATURED_PROJECTS_LIMIT } from "./constants";
import type { Project, ProjectCategory, ProjectType } from "./types";

/** A project with its category and tech stack resolved, ready for cards and pages. */
export type ProjectWithRelations = Project & {
  type: ProjectType | null;
  category: ProjectCategory | null;
  techStack: Skill[];
};

type ProjectData = { projects: Project[]; types: ProjectType[]; categories: ProjectCategory[] };

/** Published projects with their gallery, types, and categories. Cached until edited. */
async function loadProjects(): Promise<ProjectData> {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.projects);

  const supabase = createSupabasePublicClient();
  const [projects, types, categories] = await Promise.all([
    supabase
      .from("projects")
      .select("*, project_skills(skill_id), project_images(id, path, alt, orientation, sort_order)")
      .order("sort_order", { nullsFirst: false })
      .order("started_at", { ascending: false }),
    supabase.from("project_types").select("id, name, sort_order").order("sort_order"),
    supabase.from("project_categories").select("id, name, sort_order").order("sort_order"),
  ]);
  if (projects.error) throw projects.error;
  if (types.error) throw types.error;
  if (categories.error) throw categories.error;

  const toOption = (row: { id: string; name: unknown; sort_order: number }) => ({
    id: row.id,
    name: storedText(row.name),
    sortOrder: row.sort_order,
  });

  return {
    types: types.data.map(toOption),
    categories: categories.data.map(toOption),
    projects: projects.data.map((row) => ({
      id: row.id,
      status: row.status,
      sortOrder: row.sort_order,
      deletedAt: row.deleted_at,
      slug: row.slug,
      title: storedText(row.title),
      summary: storedText(row.summary),
      thumbnailPath: row.thumbnail_path,
      typeId: row.type_id,
      categoryId: row.category_id,
      projectStatus: row.project_status,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      isFeatured: row.is_featured,
      repoUrl: row.repo_url,
      demoUrl: row.demo_url,
      playStoreUrl: row.play_store_url,
      appStoreUrl: row.app_store_url,
      skillIds: row.project_skills.map((link) => link.skill_id),
      overview: storedText(row.overview),
      problem: storedText(row.problem),
      solution: storedText(row.solution),
      features: storedText(row.features),
      challenges: storedText(row.challenges),
      images: [...row.project_images]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((image) => ({
          id: image.id,
          path: image.path,
          alt: storedText(image.alt),
          orientation: image.orientation,
          sortOrder: image.sort_order,
        })),
    })),
  };
}

async function withRelations(
  project: Project,
  { types, categories }: ProjectData,
): Promise<ProjectWithRelations> {
  return {
    ...project,
    type: types.find((type) => type.id === project.typeId) ?? null,
    category: categories.find((category) => category.id === project.categoryId) ?? null,
    techStack: await getSkillsByIds(project.skillIds),
  };
}

/** All published projects, manual order first, then newest first (Case 01 §5.4). */
export async function getPublishedProjects(): Promise<ProjectWithRelations[]> {
  const data = await loadProjects();
  return Promise.all(data.projects.map((project) => withRelations(project, data)));
}

/** Types that have at least one published project, in manual order. */
export async function getUsedProjectTypes(): Promise<ProjectType[]> {
  const { projects, types } = await loadProjects();
  const used = new Set(projects.map((project) => project.typeId));
  return types.filter((type) => used.has(type.id));
}

/** Categories that have at least one published project, in manual order. */
export async function getUsedProjectCategories(): Promise<ProjectCategory[]> {
  const { projects, categories } = await loadProjects();
  const used = new Set(projects.map((project) => project.categoryId));
  return categories.filter((category) => used.has(category.id));
}

/** Published featured projects for Home, at most FEATURED_PROJECTS_LIMIT. */
export async function getFeaturedProjects(): Promise<ProjectWithRelations[]> {
  const data = await loadProjects();
  const featured = data.projects
    .filter((project) => project.isFeatured)
    .slice(0, FEATURED_PROJECTS_LIMIT);
  return Promise.all(featured.map((project) => withRelations(project, data)));
}

/** One published project by slug, or `null` (the page then returns 404). */
export async function getProjectBySlug(slug: string): Promise<ProjectWithRelations | null> {
  const data = await loadProjects();
  const project = data.projects.find((item) => item.slug === slug);
  return project ? withRelations(project, data) : null;
}

/** Slugs of all published projects, for static generation. */
export async function getPublishedProjectSlugs(): Promise<string[]> {
  const { projects } = await loadProjects();
  return projects.map((project) => project.slug);
}
