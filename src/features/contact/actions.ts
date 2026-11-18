"use server";

import { currentVisitorHash } from "@/lib/analytics/current-visitor";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { CONTACT_RATE_LIMIT_PER_HOUR, contactMessageSchema } from "./schema";

/** Translation keys under `contact.sendErrors`. */
export type ContactSendError = "invalid" | "rateLimited" | "failed";

export type ContactSendResult = { ok: true } | { ok: false; error: ContactSendError };

/**
 * Saves a contact message for the admin Inbox (Case 02 §10.3). Validated again here,
 * limited to 3 per visitor per hour, and honeypot submissions are dropped silently.
 */
export async function sendContactMessage(input: unknown): Promise<ContactSendResult> {
  const parsed = contactMessageSchema.safeParse(input);
  if (!parsed.success) {
    // A filled honeypot means a bot: pretend it worked, so it learns nothing.
    const honeypotOnly = parsed.error.issues.every((issue) => issue.path[0] === "website");
    return honeypotOnly ? { ok: true } : { ok: false, error: "invalid" };
  }

  try {
    const visitorHash = await currentVisitorHash();
    if (!visitorHash) return { ok: true };

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("submit_contact_message", {
      sender_name: parsed.data.name,
      sender_email: parsed.data.email,
      message_body: parsed.data.message,
      sender_hash: visitorHash,
      max_per_hour: CONTACT_RATE_LIMIT_PER_HOUR,
    });
    if (error) throw error;

    return data === "rate_limited" ? { ok: false, error: "rateLimited" } : { ok: true };
  } catch (error) {
    console.error("[contact] Could not save the message", error);
    return { ok: false, error: "failed" };
  }
}
