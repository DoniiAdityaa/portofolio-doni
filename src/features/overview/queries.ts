import "server-only";

import type { ContentTable } from "@/lib/actions/content-rows";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ContentCounts = { table: ContentTable; published: number; draft: number };

export type OverviewCounts = {
  content: ContentCounts[];
  unreadMessages: number;
  trash: number;
};

const CONTENT_TABLES: ContentTable[] = [
  "projects",
  "experiences",
  "educations",
  "achievements",
  "skills",
];

/** Counts for the admin Overview (Case 03 M4 #12). Visitor statistics arrive in M6. */
export async function getOverviewCounts(): Promise<OverviewCounts> {
  const supabase = await createSupabaseServerClient();

  const count = async (table: ContentTable, filter: "published" | "draft" | "trash") => {
    let query = supabase.from(table as "skills").select("id", { count: "exact", head: true });
    query =
      filter === "trash"
        ? query.not("deleted_at", "is", null)
        : query.is("deleted_at", null).eq("status", filter);
    const { count: total, error } = await query;
    if (error) throw error;
    return total ?? 0;
  };

  const [content, trashCounts, unread] = await Promise.all([
    Promise.all(
      CONTENT_TABLES.map(async (table) => ({
        table,
        published: await count(table, "published"),
        draft: await count(table, "draft"),
      })),
    ),
    Promise.all(CONTENT_TABLES.map((table) => count(table, "trash"))),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false)
      .is("archived_at", null),
  ]);
  if (unread.error) throw unread.error;

  return {
    content,
    unreadMessages: unread.count ?? 0,
    trash: trashCounts.reduce((sum, value) => sum + value, 0),
  };
}
