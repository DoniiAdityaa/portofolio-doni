import { cacheLife, cacheTag } from "next/cache";

import { getSiteSettings } from "@/features/settings/queries";
import { serverEnv } from "@/lib/config/server";

import { dummyGithubSnapshot } from "./dummy";
import { fetchGithubSnapshot } from "./github-api";
import type { GithubSnapshot } from "./types";

/** Cache tag for GitHub data; M6's "Refresh now" button invalidates it. */
export const GITHUB_CACHE_TAG = "github";

/**
 * GitHub data for the Dashboard, fetched live and cached for a day.
 *
 * - No GITHUB_TOKEN (local setup, CI): returns the dummy snapshot so pages still render.
 * - GitHub fails or the user is missing: returns `null`, and the Dashboard shows a
 *   friendly message. Failures are not cached, so the next visit tries again.
 *
 * M6 replaces the live fetch with the stored `github_snapshot` row refreshed by a daily job.
 */
export async function getGithubSnapshot(): Promise<GithubSnapshot | null> {
  const token = serverEnv.GITHUB_TOKEN;
  if (!token) return dummyGithubSnapshot;

  const { githubUsername } = await getSiteSettings();
  if (!githubUsername) return null;

  try {
    return await loadGithubSnapshot(githubUsername, token);
  } catch (error) {
    console.error("[github] Could not load the GitHub snapshot", error);
    return null;
  }
}

/** Cached for a day per username. Throws on failure, and errors are never cached. */
async function loadGithubSnapshot(username: string, token: string): Promise<GithubSnapshot> {
  "use cache";
  cacheLife("days");
  cacheTag(GITHUB_CACHE_TAG);

  return fetchGithubSnapshot(username, token);
}
