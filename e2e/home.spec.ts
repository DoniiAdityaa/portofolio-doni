import { expect, test } from "@playwright/test";

test("the root URL redirects to English, the default language", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Hi, I'm Doni");
});

test("the hero greets visitors in the active language", async ({ page }) => {
  await page.goto("/id");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Halo, saya Doni");
});

test("skills can be filtered by category", async ({ page }) => {
  await page.goto("/en");
  const skills = page.getByRole("region", { name: "Skills" });

  await expect(skills.getByText("React", { exact: true })).toBeVisible();
  await skills.getByRole("button", { name: /^Mobile/ }).click();

  await expect(skills.getByRole("button", { name: /^Mobile/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(skills.getByText("Flutter", { exact: true })).toBeVisible();
  await expect(skills.getByText("React", { exact: true })).toBeHidden();
});

test("featured projects show at most three cards and open the detail page", async ({ page }) => {
  await page.goto("/en");
  const featured = page.getByRole("region", { name: "Featured projects" });
  const cards = featured.getByRole("link", { name: /PokeAtlas|Laundry Hub|StockWise/ });

  await expect(cards).toHaveCount(3);
  await featured.getByRole("link", { name: /PokeAtlas/ }).click();

  await expect(page).toHaveURL(/\/en\/projects\/pokeatlas$/);
  await expect(page.getByRole("heading", { level: 1, name: "PokeAtlas" })).toBeVisible();
});
