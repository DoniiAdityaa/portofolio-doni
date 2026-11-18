import "server-only";

import { createClient } from "@supabase/supabase-js";

import { serverEnv } from "@/lib/config/server";

import { getSupabaseConfig } from "./config";
import type { Database } from "./database.types";

/**
 * Supabase client with the secret key: it bypasses RLS. Used only by the daily GitHub
 * cron job (Case 02 §12), which runs without a signed-in user. Never use it for requests
 * a visitor can trigger.
 */
export function createSupabaseServiceClient() {
  const { url } = getSupabaseConfig();
  const secretKey = serverEnv.SUPABASE_SECRET_KEY;
  if (!secretKey) throw new Error("SUPABASE_SECRET_KEY is not set (see .env.example).");

  return createClient<Database>(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
