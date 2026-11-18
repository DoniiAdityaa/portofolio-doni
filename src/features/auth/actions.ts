"use server";

import { redirect } from "next/navigation";

import { ADMIN_LOGIN_PATH, safeAdminRedirect } from "@/lib/auth/paths";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { signInSchema } from "./schema";

/** `email` is sent back so the field keeps its value after a failed attempt. */
export type SignInState = { error: string | null; email: string };

/** Signs the owner in. Accounts that are not in `admin_users` are signed out again. */
export async function signIn(_previous: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "");
  const parsed = signInSchema.safeParse({ email, password: formData.get("password") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form.", email };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  // One message for every failure, so the form never reveals which emails exist.
  if (error) return { error: "Wrong email or password.", email };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "This account has no admin access.", email };
  }

  redirect(safeAdminRedirect(formData.get("next")));
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(ADMIN_LOGIN_PATH);
}
