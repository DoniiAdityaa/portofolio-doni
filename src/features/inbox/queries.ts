import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type InboxMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  archivedAt: string | null;
};

export type InboxView = "inbox" | "archived";

/** Messages from the contact form, newest first (Case 03 M4 #10). */
export async function getMessages(view: InboxView): Promise<InboxMessage[]> {
  const supabase = await createSupabaseServerClient();
  const query = supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  const { data, error } =
    view === "archived"
      ? await query.not("archived_at", "is", null)
      : await query.is("archived_at", null);
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    isRead: row.is_read,
    createdAt: row.created_at,
    archivedAt: row.archived_at,
  }));
}
