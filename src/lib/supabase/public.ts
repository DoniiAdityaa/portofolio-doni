import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "./config";
import type { Database } from "./database.types";

/**
 * Supabase client for public pages: no cookies and no session, so it can run inside
 * `"use cache"` functions. It reads as an anonymous visitor, so RLS only returns
 * published, non-archived rows.
 */
export function createSupabasePublicClient() {
  const { url, publishableKey } = getSupabaseConfig();
  return createClient<Database>(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
