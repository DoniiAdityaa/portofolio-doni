import "server-only";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { ADMIN_LOGIN_PATH } from "./paths";

export type AdminUser = { id: string; email: string };

/** Thrown by `requireAdmin()`; M4's action wrapper turns it into `{ ok: false }`. */
export class NotAdminError extends Error {
  constructor() {
    super("Admin access required.");
    this.name = "NotAdminError";
  }
}

/** The signed-in admin, or `null` for visitors and signed-in users who are not admins. */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) return null;

  return { id: claims.sub, email: typeof claims.email === "string" ? claims.email : "" };
}

/** For admin pages: sends anyone who is not an admin to the login page. */
export async function requireAdminPage(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) redirect(ADMIN_LOGIN_PATH);
  return admin;
}

/** For server actions (Case 02 §8, layer 2): every admin action calls this first. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) throw new NotAdminError();
  return admin;
}
