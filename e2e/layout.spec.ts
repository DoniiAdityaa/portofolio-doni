import { expect, test } from "@playwright/test";

test.describe("language toggle", () => {
  test("switches EN to ID and keeps the current page", async ({ page, isMobile }) => {
    await page.goto("/en/projects");
    await expect(page.getByRole("heading", { level: 1, name: "Projects" })).toBeVisible();

    if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("button", { name: "Bahasa Indonesia" }).click();

    await expect(page).toHaveURL(/\/id\/projects$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
    await expect(page.getByRole("heading", { level: 1, name: "Proyek" })).toBeVisible();
  });
});

test.describe("navigation", () => {
  test("desktop sidebar marks the current page", async ({ page, isMobile }) => {
    test.skip(isMobile, "The sidebar is replaced by a drawer on phones.");

    await page.goto("/en/about");
    const nav = page.getByRole("navigation", { name: "Main navigation" });

    await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
    await nav.getByRole("link", { name: "Dashboard" }).click();
    await expect(page).toHaveURL(/\/en\/dashboard$/);
  });

  test("mobile drawer opens, navigates, and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "The drawer is only used on phones.");

    await page.goto("/en");
    await page.getByRole("button", { name: "Open menu" }).click();
    const drawer = page.getByRole("dialog", { name: "Menu" });
    await expect(drawer).toBeVisible();

    await drawer.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/\/en\/contact$/);
    await expect(drawer).toBeHidden();
  });
});

test("unknown pages show a translated 404", async ({ page }) => {
  const response = await page.goto("/id/halaman-yang-tidak-ada");

  expect(response?.status()).toBe(404);
  await expect(page.getByText("Halaman tidak ditemukan")).toBeVisible();
});

test("the theme toggle switches to light mode and remembers it", async ({ page, isMobile }) => {
  await page.goto("/en");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "dark");

  if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("button", { name: "Light mode" }).click();
  await expect(html).toHaveAttribute("data-theme", "light");

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "light");
});
