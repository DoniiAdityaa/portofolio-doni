import { expect, test } from "@playwright/test";

test("the root URL redirects to English, the default language", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Mobile Developer");
});

test("the hero greets visitors in the active language", async ({ page }) => {
  await page.goto("/id");

  await expect(page.getByText("Halo, saya Doni")).toBeVisible();
});
