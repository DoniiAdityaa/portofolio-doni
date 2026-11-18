import "server-only";

import { z } from "zod";

import type { PublicationStatus } from "@/lib/content/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { getIconPreview, type IconPreview } from "./icon-preview";
import type { SkillCategoryFormValues } from "./schema";

export type AdminSkillCategory = Required<SkillCategoryFormValues>;

export type AdminSkill = {
  id: string;
  name: string;
  iconSlug: string;
  categoryId: string;
  status: PublicationStatus;
  icon: IconPreview | null;
};

const storedText = z.object({ en: z.string(), id: z.string() }).catch({ en: "", id: "" });

/** Categories and active (non-archived) skills, in their manual order. */
export async function getSkillsForAdmin(): Promise<{
  categories: AdminSkillCategory[];
  skills: AdminSkill[];
}> {
  const supabase = await createSupabaseServerClient();
  const [categories, skills] = await Promise.all([
    supabase.from("skill_categories").select("id, name").order("sort_order"),
    supabase
      .from("skills")
      .select("id, name, icon_slug, category_id, status")
      .is("deleted_at", null)
      .order("sort_order", { nullsFirst: false })
      .order("name"),
  ]);
  if (categories.error) throw categories.error;
  if (skills.error) throw skills.error;

  return {
    categories: categories.data.map((row) => ({ id: row.id, name: storedText.parse(row.name) })),
    skills: skills.data.map((row) => ({
      id: row.id,
      name: row.name,
      iconSlug: row.icon_slug,
      categoryId: row.category_id,
      status: row.status,
      icon: getIconPreview(row.icon_slug),
    })),
  };
}

/** Every active skill as `{ id, name }`, for skill pickers in other modules. */
export async function getSkillOptions(): Promise<{ id: string; name: string }[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("skills")
    .select("id, name")
    .is("deleted_at", null)
    .order("name");
  if (error) throw error;
  return data;
}
