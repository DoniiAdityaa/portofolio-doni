import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { ADMIN_HOME_PATH } from "@/lib/auth/paths";
import { routing } from "@/lib/i18n/routing";
import { guardAdminRoute } from "@/lib/supabase/proxy";

const intlMiddleware = createIntlMiddleware(routing);

/**
 * - `/admin/*` (English only): refreshes the session and requires sign-in (Case 02 §8).
 * - Everything else: adds the locale prefix, e.g. `/projects` → `/en/projects`.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdmin = pathname === ADMIN_HOME_PATH || pathname.startsWith(`${ADMIN_HOME_PATH}/`);

  return isAdmin ? guardAdminRoute(request) : intlMiddleware(request);
}

export const config = {
  // Skip API routes, Next.js internals, and files.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
