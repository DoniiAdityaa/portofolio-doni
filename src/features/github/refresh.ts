import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { serverEnv } from "@/lib/config/server";
import type { Database } from "@/lib/supabase/database.types";

import { fetchGithubSnapshot } from "./github-api";

export type RefreshResult =
  | { ok: true; fetchedAt: string }
  | { ok: false; reason: "no-token" | "no-username" | "github-failed" };

/**
 * Fetches fresh GitHub data and saves it as the snapshot (Case 02 §10.1). On any failure
 * the previous snapshot stays untouched, so the Dashboard keeps showing it.
 * `supabase` must be allowed to write github_snapshot: the admin's client or the cron's.
 */
export async function refreshGithubSnapshot(
  supabase: SupabaseClient<Database>,
): Promise<RefreshResult> {
  const token = serverEnv.GITHUB_TOKEN;
  if (!token) return { ok: false, reason: "no-token" };

  const { data: settings, error: settingsError } = await supabase
    .from("site_settings")
    .select("github_username")
    .maybeSingle();
  if (settingsError) throw settingsError;
  const username = settings?.github_username;
  if (!username) return { ok: false, reason: "no-username" };

  let snapshot;
  try {
    snapshot = await fetchGithubSnapshot(username, token);
  } catch (error) {
    console.error("[github] Fetch failed; keeping the previous snapshot", error);
    return { ok: false, reason: "github-failed" };
  }

  const { fetchedAt, ...data } = snapshot;
  const { error } = await supabase
    .from("github_snapshot")
    .upsert({ id: 1, data, fetched_at: fetchedAt });
  if (error) throw error;

  return { ok: true, fetchedAt };
}
