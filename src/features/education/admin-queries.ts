import "server-only";

import { z } from "zod";

import type { ContentListItem } from "@/components/admin/content-list";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { EducationFormValues } from "./schema";

const storedText = z.object({ en: z.string(), id: z.string() }).catch({ en: "", id: "" });

/** Active education entries for the admin list, in public order. */
export async function getEducationsForAdmin(): Promise<{
  items: ContentListItem[];
  hasManualOrder: boolean;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("educations")
    .select("id, institution, degree, start_date, end_date, status, sort_order, logo_path")
    .is("deleted_at", null)
    .order("sort_order", { nullsFirst: false })
    .order("start_date", { ascending: false });
  if (error) throw error;

  return {
    hasManualOrder: data.some((row) => row.sort_order !== null),
    items: data.map((row) => ({
      id: row.id,
      title: `${storedText.parse(row.degree).en} · ${row.institution}`,
      subtitle: `${row.start_date} – ${row.end_date ?? "Present"}`,
      status: row.status,
      imagePath: row.logo_path,
    })),
  };
}

/** One education entry as form values, or `null` when it does not exist. */
export async function getEducationForEdit(id: string): Promise<EducationFormValues | null> {
  if (!z.uuid().safeParse(id).success) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("educations").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    institution: data.institution,
    logoPath: data.logo_path,
    degree: storedText.parse(data.degree),
    startDate: data.start_date,
    endDate: data.end_date ?? "",
    notes: storedText.parse(data.notes),
    status: data.status,
  };
}

export const EMPTY_EDUCATION: EducationFormValues = {
  institution: "",
  logoPath: null,
  degree: { en: "", id: "" },
  startDate: "",
  endDate: "",
  notes: { en: "", id: "" },
  status: "draft",
};
