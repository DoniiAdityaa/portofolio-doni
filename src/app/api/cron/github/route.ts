import { timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";

import { GITHUB_CACHE_TAG } from "@/features/github/queries";
import { refreshGithubSnapshot } from "@/features/github/refresh";
import { serverEnv } from "@/lib/config/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

/**
 * Daily GitHub refresh, called by Vercel Cron (vercel.json) with
 * `Authorization: Bearer <CRON_SECRET>`. Anything else gets 401.
 */
export async function GET(request: Request) {
  if (!isAuthorized(request.headers.get("authorization"))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await refreshGithubSnapshot(createSupabaseServiceClient());
  if (result.ok) revalidateTag(GITHUB_CACHE_TAG, "max");

  return Response.json(result, { status: result.ok ? 200 : 502 });
}

function isAuthorized(header: string | null): boolean {
  const secret = serverEnv.CRON_SECRET;
  if (!secret || !header) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(header);
  return expected.length === received.length && timingSafeEqual(expected, received);
}
