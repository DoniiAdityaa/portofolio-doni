import { expect, test } from "@playwright/test";

test("the root URL redirects to English, the default language", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("the lightbox opens and closes with the Escape key", async ({ page }) => {
  await page.goto("/en");

  await page.getByRole("button", { name: "Open lightbox" }).click();
  const dialog = page.getByRole("dialog", { name: "Certificate preview" });
  await expect(dialog).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
