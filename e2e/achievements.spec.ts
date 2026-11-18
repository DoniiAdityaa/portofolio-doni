import { expect, test } from "@playwright/test";

test("lists certificates and awards", async ({ page }) => {
  await page.goto("/en/achievements");

  await expect(page.getByRole("heading", { level: 1, name: "Achievement" })).toBeVisible();
  await expect(page.getByRole("button", { name: /^View details for/ })).toHaveCount(6);
  await expect(page.getByText("6 items")).toBeVisible();
});

test("filters by type", async ({ page }) => {
  await page.goto("/en/achievements");

  await page.getByRole("combobox", { name: "Type" }).click();
  await page.getByRole("option", { name: "Award" }).click();

  await expect(page.getByRole("button", { name: /^View details for/ })).toHaveCount(2);
  await expect(page.getByText("2 items")).toBeVisible();
});

test("searches by title or issuer", async ({ page }) => {
  await page.goto("/en/achievements");
  const search = page.getByRole("searchbox", { name: "Search certificates" });

  await search.fill("dicoding");
  await expect(page.getByRole("button", { name: /^View details for/ })).toHaveCount(3);

  await search.fill("firebase");
  await expect(page.getByRole("button", { name: /^View details for/ })).toHaveCount(1);
  await expect(page.getByRole("button", { name: /Firebase for Mobile Apps/ })).toBeVisible();
});

test("shows an empty state that resets the filters", async ({ page }) => {
  await page.goto("/en/achievements");

  await page.getByRole("combobox", { name: "Type" }).click();
  await page.getByRole("option", { name: "Award" }).click();
  await page.getByRole("combobox", { name: "Category" }).click();
  await page.getByRole("option", { name: "Cloud" }).click();

  await expect(page.getByText("Nothing matches these filters")).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.getByRole("button", { name: /^View details for/ })).toHaveCount(6);
});

test("opens a lightbox with details and a Verify link, closed by Escape", async ({ page }) => {
  await page.goto("/en/achievements");

  await page
    .getByRole("button", { name: "View details for Flutter Application Developer Expert" })
    .click();
  const dialog = page.getByRole("dialog", { name: "Flutter Application Developer Expert" });

  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("DUMMY-FLT-2026")).toBeVisible();
  await expect(dialog.getByText("Dicoding Indonesia").first()).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Verify credential" })).toHaveAttribute(
    "target",
    "_blank",
  );

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("the viewer closes with its round close button", async ({ page }) => {
  await page.goto("/en/achievements");

  await page.getByRole("button", { name: "View details for Firebase for Mobile Apps" }).click();
  const dialog = page.getByRole("dialog", { name: "Firebase for Mobile Apps" });
  await expect(dialog).toBeVisible();

  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
});

test("awards without a credential link have no Verify button", async ({ page }) => {
  await page.goto("/id/achievements");

  await page.getByRole("button", { name: "Lihat detail Juara 1 Hackathon Mobile Kampus" }).click();
  const dialog = page.getByRole("dialog");

  await expect(dialog.getByText("Tanpa masa berlaku")).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Verifikasi kredensial" })).toHaveCount(0);
});
