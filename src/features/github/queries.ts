import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import { createSupabasePublicClient } from "@/lib/supabase/public";

import type { GithubSnapshot } from "./types";

/** Cache tag for GitHub data; the cron job and "Refresh now" expire it. */
export const GITHUB_CACHE_TAG = "github";

/** Just enough shape checking that a broken row shows the friendly message, not a crash. */
const storedSnapshot = z.looseObject({
  username: z.string(),
  totalContributions: z.number(),
  profile: z.looseObject({}),
  contributions: z.array(z.looseObject({})),
  pinnedRepositories: z.array(z.looseObject({})),
  languages: z.array(z.looseObject({})),
});

/**
 * The last good GitHub snapshot for the Dashboard (Case 02 §10.1), stored by the daily
 * job. `null` until the first snapshot exists; the Dashboard then shows a friendly message.
 */
export async function getGithubSnapshot(): Promise<GithubSnapshot | null> {
  "use cache";
  cacheLife("days");
  cacheTag(GITHUB_CACHE_TAG);

  const { data, error } = await createSupabasePublicClient()
    .from("github_snapshot")
    .select("data, fetched_at")
    .maybeSingle();
  if (error) throw error;
  if (!data || !storedSnapshot.safeParse(data.data).success) return null;

  return { ...(data.data as GithubSnapshot), fetchedAt: data.fetched_at };
}
