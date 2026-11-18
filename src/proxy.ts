import createMiddleware from "next-intl/middleware";

import { routing } from "@/lib/i18n/routing";

/** Adds the locale prefix to public URLs, e.g. `/` → `/en` and `/projects` → `/en/projects`. */
export default createMiddleware(routing);

export const config = {
  // Skip API routes, the admin area (English only, Case 02), Next.js internals, and files.
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
