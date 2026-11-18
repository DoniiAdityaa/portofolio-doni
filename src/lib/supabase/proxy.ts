import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH } from "@/lib/auth/paths";

import { getSupabaseConfig } from "./config";
import type { Database } from "./database.types";

/**
 * Route guard for `/admin` (Case 02 §8, layer 1). Refreshes the Supabase session cookie
 * and sends visitors without a session to the login page.
 *
 * This is only the first, optimistic check: the protected layout and every server
 * action check admin status again, and RLS is the final guard.
 */
export async function guardAdminRoute(request: NextRequest): Promise<NextResponse> {
  const { url, publishableKey } = getSupabaseConfig();
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // getClaims() verifies the JWT, unlike getSession(), which only reads the cookie.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  const { pathname } = request.nextUrl;

  if (!signedIn && pathname !== ADMIN_LOGIN_PATH) {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
    if (pathname !== ADMIN_HOME_PATH) loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
