import { z } from "zod";

import { currentVisitorHash } from "@/lib/analytics/current-visitor";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const pageViewSchema = z.object({
  path: z.string().startsWith("/").max(300),
  locale: z.enum(["en", "id"]),
  referrer: z.string().max(2000).optional(),
});

/**
 * Records one page view (Case 02 §10.2). Bots and the signed-in admin are not counted,
 * and only the referrer's host is kept. Always answers 204 so tracking never shows errors.
 */
export async function POST(request: Request) {
  const parsed = pageViewSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return new Response(null, { status: 204 });

  const visitorHash = await currentVisitorHash();
  if (!visitorHash) return new Response(null, { status: 204 });

  const supabase = await createSupabaseServerClient();
  // Sign-up is disabled, so any signed-in user is the admin.
  const { data: session } = await supabase.auth.getClaims();
  if (session?.claims) return new Response(null, { status: 204 });

  const { error } = await supabase.rpc("record_page_view", {
    view_path: parsed.data.path,
    view_locale: parsed.data.locale,
    // Empty means "direct visit"; the database stores it as null.
    view_referrer_host: referrerHost(parsed.data.referrer, request.url) ?? "",
    view_visitor_hash: visitorHash,
  });
  if (error) console.error("[track] Could not record the page view", error);

  return new Response(null, { status: 204 });
}

/** The referring site's host, or `null` for direct visits and our own pages. */
function referrerHost(referrer: string | undefined, ownUrl: string): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).host;
    return host === new URL(ownUrl).host ? null : host;
  } catch {
    return null;
  }
}
