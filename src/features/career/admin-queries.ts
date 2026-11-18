import "server-only";

import { z } from "zod";

import type { ContentListItem } from "@/components/admin/content-list";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { EXPERIENCE_TYPE_LABELS, type ExperienceFormValues } from "./schema";

const storedText = z.object({ en: z.string(), id: z.string() }).catch({ en: "", id: "" });

/** Active experiences for the admin list, in public order (manual first, then newest). */
export async function getExperiencesForAdmin(): Promise<{
  items: ContentListItem[];
  hasManualOrder: boolean;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("id, company, position, type, start_date, end_date, status, sort_order, logo_path")
    .is("deleted_at", null)
    .order("sort_order", { nullsFirst: false })
    .order("start_date", { ascending: false });
  if (error) throw error;

  return {
    hasManualOrder: data.some((row) => row.sort_order !== null),
    items: data.map((row) => ({
      id: row.id,
      title: `${storedText.parse(row.position).en} · ${row.company}`,
      subtitle: `${EXPERIENCE_TYPE_LABELS[row.type]} · ${row.start_date} – ${row.end_date ?? "Present"}`,
      status: row.status,
      imagePath: row.logo_path,
    })),
  };
}

/** One experience as form values, or `null` when it does not exist. */
export async function getExperienceForEdit(id: string): Promise<ExperienceFormValues | null> {
  if (!z.uuid().safeParse(id).success) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*, experience_skills(skill_id)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    company: data.company,
    logoPath: data.logo_path,
    position: storedText.parse(data.position),
    type: data.type,
    startDate: data.start_date,
    endDate: data.end_date ?? "",
    responsibilities: storedText.parse(data.responsibilities),
    learnings: storedText.parse(data.learnings),
    impact: storedText.parse(data.impact),
    skillIds: data.experience_skills.map((link) => link.skill_id),
    status: data.status,
  };
}

export const EMPTY_EXPERIENCE: ExperienceFormValues = {
  company: "",
  logoPath: null,
  position: { en: "", id: "" },
  type: "full_time",
  startDate: "",
  endDate: "",
  responsibilities: { en: "", id: "" },
  learnings: { en: "", id: "" },
  impact: { en: "", id: "" },
  skillIds: [],
  status: "draft",
};
