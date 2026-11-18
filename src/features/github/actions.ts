"use server";

import { updateTag } from "next/cache";
import { z } from "zod";

import { runAdminAction } from "@/lib/actions/admin-action";
import { type ActionResult, fail, ok } from "@/lib/actions/result";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { GITHUB_CACHE_TAG } from "./queries";
import { refreshGithubSnapshot } from "./refresh";

const FAILURE_MESSAGES = {
  "no-token": "GITHUB_TOKEN is not set on the server.",
  "no-username": "Add your GitHub username in Site settings first.",
  "github-failed": "GitHub did not answer. The previous data is kept; try again later.",
} as const;

/** Admin "Refresh now" for the Dashboard's GitHub data (Case 02 §10.1). */
export async function refreshGithubNow(): Promise<ActionResult<{ fetchedAt: string }>> {
  return runAdminAction(z.undefined(), undefined, async () => {
    const result = await refreshGithubSnapshot(await createSupabaseServerClient());
    if (!result.ok) return fail(FAILURE_MESSAGES[result.reason]);

    updateTag(GITHUB_CACHE_TAG);
    return ok({ fetchedAt: result.fetchedAt });
  });
}
