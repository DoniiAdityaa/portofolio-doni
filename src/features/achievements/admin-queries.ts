import "server-only";

import { z } from "zod";

import type { ContentListItem } from "@/components/admin/content-list";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { ACHIEVEMENT_TYPE_LABELS, type AchievementFormValues } from "./schema";

const storedText = z.object({ en: z.string(), id: z.string() }).catch({ en: "", id: "" });

/** Active achievements for the admin list, in public order (manual first, then newest). */
export async function getAchievementsForAdmin(): Promise<{
  items: ContentListItem[];
  hasManualOrder: boolean;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("id, title, type, issuer, issued_at, status, sort_order, image_path")
    .is("deleted_at", null)
    .order("sort_order", { nullsFirst: false })
    .order("issued_at", { ascending: false });
  if (error) throw error;

  return {
    hasManualOrder: data.some((row) => row.sort_order !== null),
    items: data.map((row) => ({
      id: row.id,
      title: storedText.parse(row.title).en,
      subtitle: `${ACHIEVEMENT_TYPE_LABELS[row.type]} · ${row.issuer} · ${row.issued_at}`,
      status: row.status,
      imagePath: row.image_path,
    })),
  };
}

/** One achievement as form values, or `null` when it does not exist. */
export async function getAchievementForEdit(id: string): Promise<AchievementFormValues | null> {
  if (!z.uuid().safeParse(id).success) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("*, achievement_skills(skill_id)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    title: storedText.parse(data.title),
    type: data.type,
    imagePath: data.image_path,
    issuer: data.issuer,
    issuedAt: data.issued_at,
    expiresAt: data.expires_at ?? "",
    credentialUrl: data.credential_url ?? "",
    credentialId: data.credential_id ?? "",
    categoryId: data.category_id ?? "",
    description: storedText.parse(data.description),
    skillIds: data.achievement_skills.map((link) => link.skill_id),
    status: data.status,
  };
}

export const EMPTY_ACHIEVEMENT: AchievementFormValues = {
  title: { en: "", id: "" },
  type: "certificate",
  imagePath: null,
  issuer: "",
  issuedAt: "",
  expiresAt: "",
  credentialUrl: "",
  credentialId: "",
  categoryId: "",
  description: { en: "", id: "" },
  skillIds: [],
  status: "draft",
};
