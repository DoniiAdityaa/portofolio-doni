import "server-only";

import { z } from "zod";

import type { ContentListItem } from "@/components/admin/content-list";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { PROJECT_STATUS_LABELS, type ProjectFormValues } from "./schema";

const EMPTY_TEXT = { en: "", id: "" };
const storedText = z.object({ en: z.string(), id: z.string() }).catch(EMPTY_TEXT);

/** Active projects for the admin list, in public order (manual first, then newest). */
export async function getProjectsForAdmin(): Promise<{
  items: ContentListItem[];
  hasManualOrder: boolean;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, project_status, started_at, is_featured, status, sort_order, thumbnail_path",
    )
    .is("deleted_at", null)
    .order("sort_order", { nullsFirst: false })
    .order("started_at", { ascending: false });
  if (error) throw error;

  return {
    hasManualOrder: data.some((row) => row.sort_order !== null),
    items: data.map((row) => ({
      id: row.id,
      title: `${row.is_featured ? "★ " : ""}${storedText.parse(row.title).en}`,
      subtitle: `/${row.slug} · ${PROJECT_STATUS_LABELS[row.project_status]} · ${row.started_at}`,
      status: row.status,
      imagePath: row.thumbnail_path,
    })),
  };
}

/** One project as form values, or `null` when it does not exist. */
export async function getProjectForEdit(id: string): Promise<ProjectFormValues | null> {
  if (!z.uuid().safeParse(id).success) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_skills(skill_id), project_images(path, alt, orientation, sort_order)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: storedText.parse(data.title),
    summary: storedText.parse(data.summary),
    thumbnailPath: data.thumbnail_path,
    typeId: data.type_id,
    categoryId: data.category_id,
    projectStatus: data.project_status,
    startDate: data.started_at,
    endDate: data.ended_at ?? "",
    isFeatured: data.is_featured,
    repoUrl: data.repo_url ?? "",
    demoUrl: data.demo_url ?? "",
    playStoreUrl: data.play_store_url ?? "",
    appStoreUrl: data.app_store_url ?? "",
    overview: storedText.parse(data.overview),
    problem: storedText.parse(data.problem),
    solution: storedText.parse(data.solution),
    features: storedText.parse(data.features),
    challenges: storedText.parse(data.challenges),
    skillIds: data.project_skills.map((link) => link.skill_id),
    images: [...data.project_images]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => ({
        path: image.path,
        alt: storedText.parse(image.alt),
        orientation: image.orientation,
      })),
    status: data.status,
  };
}

export function emptyProject(typeId = "", categoryId = ""): ProjectFormValues {
  return {
    slug: "",
    title: EMPTY_TEXT,
    summary: EMPTY_TEXT,
    thumbnailPath: null,
    typeId,
    categoryId,
    projectStatus: "in_progress",
    startDate: "",
    endDate: "",
    isFeatured: false,
    repoUrl: "",
    demoUrl: "",
    playStoreUrl: "",
    appStoreUrl: "",
    overview: EMPTY_TEXT,
    problem: EMPTY_TEXT,
    solution: EMPTY_TEXT,
    features: EMPTY_TEXT,
    challenges: EMPTY_TEXT,
    skillIds: [],
    images: [],
    status: "draft",
  };
}
