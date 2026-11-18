import { expect, test } from "@playwright/test";

test("unauthenticated admin visits redirect to the login page", async ({ page }) => {
  await page.goto("/admin/projects");

  await expect(page).toHaveURL(/\/admin\/login\?next=%2Fadmin%2Fprojects$/);
  await expect(page.getByRole("heading", { level: 1, name: "Admin sign in" })).toBeVisible();
});

test("the admin area is never indexed", async ({ page }) => {
  await page.goto("/admin/login");

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("the login form validates before sending", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByRole("button", { name: "Sign in" }).click();

  // Native validation keeps the visitor on the page.
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByLabel("Email")).toBeFocused();
});

test("the GitHub cron endpoint rejects calls without the secret", async ({ request }) => {
  const response = await request.get("/api/cron/github");
  expect(response.status()).toBe(401);
});
