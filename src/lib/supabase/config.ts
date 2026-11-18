import { clientEnv } from "@/lib/config/client";

/**
 * The Supabase URL and publishable key, checked when a client is created.
 *
 * They stay optional in the env schema until M5, so the public pages (still on dummy
 * data) build without Supabase. Anything that talks to Supabase fails fast here instead.
 */
export function getSupabaseConfig(): { url: string; publishableKey: string } {
  const url = clientEnv.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local (see .env.example).",
    );
  }

  return { url, publishableKey };
}
