"use server";

import { updateTag } from "next/cache";
import { z } from "zod";

import { runAdminAction } from "@/lib/actions/admin-action";
import { deleteCategoryRow, saveCategoryRow } from "@/lib/actions/category-rows";
import {
  archiveRow,
  clearOrder,
  reorderSchema,
  replaceSkillLinks,
  rowIdSchema,
  rowStatusSchema,
  saveOrder,
  setRowStatus,
} from "@/lib/actions/content-rows";
import { type ActionResult, fail, ok } from "@/lib/actions/result";
import { removeMediaFiles } from "@/lib/actions/storage";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { categoryFormSchema } from "@/lib/content/category-schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { FEATURED_PROJECTS_LIMIT } from "./constants";
import { projectFormSchema, slugify } from "./schema";

/** Postgres: a unique constraint (here, the slug) was violated. */
const UNIQUE_VIOLATION = "23505";

function expireProjects() {
  updateTag(CACHE_TAGS.projects);
}

/** Creates or updates a project with its skills and gallery; returns its id and slug. */
export async function saveProject(
  input: unknown,
): Promise<ActionResult<{ id: string; slug: string }>> {
  return runAdminAction(projectFormSchema, input, async (values) => {
    const supabase = await createSupabaseServerClient();
    const slug = values.slug || slugify(values.title.en);
    if (!slug) return fail("Add a slug, or an English title it can be made from.");

    if (values.isFeatured) {
      let featured = supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("is_featured", true)
        .is("deleted_at", null);
      if (values.id) featured = featured.neq("id", values.id);
      const { count, error } = await featured;
      if (error) throw error;
      if ((count ?? 0) >= FEATURED_PROJECTS_LIMIT) {
        return fail(
          `Only ${FEATURED_PROJECTS_LIMIT} projects can be featured. Unfeature one first.`,
        );
      }
    }

    const row = {
      slug,
      title: values.title,
      summary: values.summary,
      thumbnail_path: values.thumbnailPath,
      type_id: values.typeId,
      category_id: values.categoryId,
      project_status: values.projectStatus,
      started_at: values.startDate,
      ended_at: values.endDate || null,
      is_featured: values.isFeatured,
      repo_url: values.repoUrl || null,
      demo_url: values.demoUrl || null,
      play_store_url: values.playStoreUrl || null,
      app_store_url: values.appStoreUrl || null,
      overview: values.overview,
      problem: values.problem,
      solution: values.solution,
      features: values.features,
      challenges: values.challenges,
      status: values.status,
    };

    let id = values.id;
    let oldFiles: (string | null)[] = [];
    if (id) {
      const { data: current, error: readError } = await supabase
        .from("projects")
        .select("thumbnail_path, project_images(path)")
        .eq("id", id)
        .single();
      if (readError) throw readError;
      oldFiles = [current.thumbnail_path, ...current.project_images.map((image) => image.path)];

      const { error } = await supabase.from("projects").update(row).eq("id", id);
      if (error?.code === UNIQUE_VIOLATION) return fail(`The slug "${slug}" is already used.`);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from("projects").insert(row).select("id").single();
      if (error?.code === UNIQUE_VIOLATION) return fail(`The slug "${slug}" is already used.`);
      if (error) throw error;
      id = data.id;
    }

    await replaceSkillLinks("project_skills", "project_id", id, values.skillIds);
    await replaceGallery(id, values.images);

    const keptFiles = new Set([values.thumbnailPath, ...values.images.map((image) => image.path)]);
    await removeMediaFiles(oldFiles.filter((path) => !keptFiles.has(path)));

    expireProjects();
    return ok({ id, slug });
  });
}

async function replaceGallery(
  projectId: string,
  images: z.infer<typeof projectFormSchema>["images"],
) {
  const supabase = await createSupabaseServerClient();
  const { error: deleteError } = await supabase
    .from("project_images")
    .delete()
    .eq("project_id", projectId);
  if (deleteError) throw deleteError;
  if (images.length === 0) return;

  const { error } = await supabase.from("project_images").insert(
    images.map((image, index) => ({
      project_id: projectId,
      path: image.path,
      alt: image.alt,
      orientation: image.orientation,
      sort_order: index + 1,
    })),
  );
  if (error) throw error;
}

export async function setProjectStatus(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowStatusSchema, input, async ({ id, status }) => {
    await setRowStatus("projects", id, status);
    expireProjects();
    return ok();
  });
}

export async function archiveProject(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowIdSchema, input, async ({ id }) => {
    await archiveRow("projects", id);
    expireProjects();
    return ok();
  });
}

export async function reorderProjects(input: unknown): Promise<ActionResult> {
  return runAdminAction(reorderSchema, input, async ({ ids }) => {
    await saveOrder("projects", ids);
    expireProjects();
    return ok();
  });
}

export async function resetProjectOrder(): Promise<ActionResult> {
  return runAdminAction(z.undefined(), undefined, async () => {
    await clearOrder("projects");
    expireProjects();
    return ok();
  });
}

// ---- Project types (platform) and categories (context), CR-06 ----

export async function saveProjectType(input: unknown): Promise<ActionResult> {
  return runAdminAction(categoryFormSchema, input, async (values) => {
    await saveCategoryRow("project_types", values);
    expireProjects();
    return ok();
  });
}

export async function deleteProjectType(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowIdSchema, input, async ({ id }) => {
    const deleted = await deleteCategoryRow("project_types", id);
    if (!deleted) return fail("Projects (including ones in Trash) still use this type.");
    expireProjects();
    return ok();
  });
}

export async function reorderProjectTypes(input: unknown): Promise<ActionResult> {
  return runAdminAction(reorderSchema, input, async ({ ids }) => {
    await saveOrder("project_types", ids);
    expireProjects();
    return ok();
  });
}

export async function saveProjectCategory(input: unknown): Promise<ActionResult> {
  return runAdminAction(categoryFormSchema, input, async (values) => {
    await saveCategoryRow("project_categories", values);
    expireProjects();
    return ok();
  });
}

export async function deleteProjectCategory(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowIdSchema, input, async ({ id }) => {
    const deleted = await deleteCategoryRow("project_categories", id);
    if (!deleted) return fail("Projects (including ones in Trash) still use this category.");
    expireProjects();
    return ok();
  });
}

export async function reorderProjectCategories(input: unknown): Promise<ActionResult> {
  return runAdminAction(reorderSchema, input, async ({ ids }) => {
    await saveOrder("project_categories", ids);
    expireProjects();
    return ok();
  });
}
