import { randomUUID } from "node:crypto";

import { chromium, type FullConfig } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

import { ADMIN_STORAGE_STATE } from "./support/admin";

const ADMIN_EMAIL = "e2e-admin@local.test";

/**
 * Creates (or resets) a local admin account with a fresh random password, signs in once,
 * and saves the session for the admin tests. Runs against local Supabase only.
 */
export default async function globalSetup(config: FullConfig) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey)
    throw new Error("E2E needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.");
  if (!/\/\/(127\.0\.0\.1|localhost)[:/]/.test(url)) {
    throw new Error("E2E admin setup only runs against a local Supabase.");
  }

  const supabase = createClient(url, secretKey, { auth: { persistSession: false } });
  const password = randomUUID();
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) throw listError;

  const existing = users.users.find((user) => user.email === ADMIN_EMAIL);
  const { data, error } = existing
    ? await supabase.auth.admin.updateUserById(existing.id, { password })
    : await supabase.auth.admin.createUser({ email: ADMIN_EMAIL, password, email_confirm: true });
  if (error) throw error;

  const { error: adminError } = await supabase
    .from("admin_users")
    .upsert({ user_id: data.user.id });
  if (adminError) throw adminError;

  const baseURL = config.projects[0]?.use.baseURL;
  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL });
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/admin");
  await page.context().storageState({ path: ADMIN_STORAGE_STATE });
  await browser.close();
}
