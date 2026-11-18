import "server-only";

import { z } from "zod";

import type { ContentTable } from "@/lib/actions/content-rows";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type TrashItem = { table: ContentTable; id: string; title: string; deletedAt: string };

const storedText = z.object({ en: z.string(), id: z.string() }).catch({ en: "", id: "" });
const english = (value: unknown) => storedText.parse(value).en;

/** Everything archived to the trash, most recently archived first (Case 03 M4 #11). */
export async function getTrashItems(): Promise<TrashItem[]> {
  const supabase = await createSupabaseServerClient();
  const archived = <T extends { deleted_at: string | null }>(rows: T[] | null) =>
    (rows ?? []).filter((row): row is T & { deleted_at: string } => row.deleted_at !== null);

  const [skills, experiences, educations, achievements, projects] = await Promise.all([
    supabase.from("skills").select("id, name, deleted_at").not("deleted_at", "is", null),
    supabase
      .from("experiences")
      .select("id, company, position, deleted_at")
      .not("deleted_at", "is", null),
    supabase
      .from("educations")
      .select("id, institution, degree, deleted_at")
      .not("deleted_at", "is", null),
    supabase.from("achievements").select("id, title, deleted_at").not("deleted_at", "is", null),
    supabase.from("projects").select("id, title, deleted_at").not("deleted_at", "is", null),
  ]);
  const failed = [skills, experiences, educations, achievements, projects].find(
    (result) => result.error,
  );
  if (failed?.error) throw failed.error;

  const items: TrashItem[] = [
    ...archived(skills.data).map((row) => ({
      table: "skills" as const,
      id: row.id,
      title: row.name,
      deletedAt: row.deleted_at,
    })),
    ...archived(experiences.data).map((row) => ({
      table: "experiences" as const,
      id: row.id,
      title: `${english(row.position)} · ${row.company}`,
      deletedAt: row.deleted_at,
    })),
    ...archived(educations.data).map((row) => ({
      table: "educations" as const,
      id: row.id,
      title: `${english(row.degree)} · ${row.institution}`,
      deletedAt: row.deleted_at,
    })),
    ...archived(achievements.data).map((row) => ({
      table: "achievements" as const,
      id: row.id,
      title: english(row.title),
      deletedAt: row.deleted_at,
    })),
    ...archived(projects.data).map((row) => ({
      table: "projects" as const,
      id: row.id,
      title: english(row.title),
      deletedAt: row.deleted_at,
    })),
  ];

  return items.sort((a, b) => b.deletedAt.localeCompare(a.deletedAt));
}
