"use server";

import { z } from "zod";

import { runAdminAction } from "@/lib/actions/admin-action";
import { rowIdSchema } from "@/lib/actions/content-rows";
import { type ActionResult, ok } from "@/lib/actions/result";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type MessageUpdate = { is_read?: boolean; archived_at?: string | null };

async function updateMessage(id: string, values: MessageUpdate) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("contact_messages").update(values).eq("id", id);
  if (error) throw error;
}

export async function setMessageRead(input: unknown): Promise<ActionResult> {
  return runAdminAction(
    z.object({ id: z.uuid(), isRead: z.boolean() }),
    input,
    async ({ id, isRead }) => {
      await updateMessage(id, { is_read: isRead });
      return ok();
    },
  );
}

/** Archiving also marks the message as read. */
export async function archiveMessage(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowIdSchema, input, async ({ id }) => {
    await updateMessage(id, { archived_at: new Date().toISOString(), is_read: true });
    return ok();
  });
}

export async function restoreMessage(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowIdSchema, input, async ({ id }) => {
    await updateMessage(id, { archived_at: null });
    return ok();
  });
}

/** Permanently deletes an archived message. */
export async function deleteMessage(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowIdSchema, input, async ({ id }) => {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id)
      .not("archived_at", "is", null);
    if (error) throw error;
    return ok();
  });
}
