import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache/tags";
import { storedText } from "@/lib/content/stored";
import { createSupabasePublicClient } from "@/lib/supabase/public";

import type { Education } from "./types";

/** Published education entries, newest first unless reordered in admin (Case 01 §5.2). */
export async function getPublishedEducations(): Promise<Education[]> {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.education);

  const { data, error } = await createSupabasePublicClient()
    .from("educations")
    .select("*")
    .order("sort_order", { nullsFirst: false })
    .order("start_date", { ascending: false });
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    status: row.status,
    sortOrder: row.sort_order,
    deletedAt: row.deleted_at,
    institution: row.institution,
    logoPath: row.logo_path,
    degree: storedText(row.degree),
    startDate: row.start_date,
    endDate: row.end_date,
    notes: storedText(row.notes),
  }));
}
