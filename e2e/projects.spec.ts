import { expect, type Page, test } from "@playwright/test";

const cards = (page: Page) =>
  page
    .getByRole("main")
    .getByRole("link", { name: /PokeAtlas|Laundry Hub|StockWise|FoodShare|Portfolio/ });

test("lists all published projects", async ({ page }) => {
  await page.goto("/en/projects");

  await expect(page.getByRole("heading", { level: 1, name: "Projects" })).toBeVisible();
  await expect(cards(page)).toHaveCount(5);
});

test("type, category, and search filters can be combined", async ({ page }) => {
  await page.goto("/en/projects");

  await page.getByRole("group", { name: "Type" }).getByRole("button", { name: "Mobile" }).click();
  await expect(cards(page)).toHaveCount(3);

  await page
    .getByRole("group", { name: "Category" })
    .getByRole("button", { name: "Freelance" })
    .click();
  await expect(cards(page)).toHaveCount(1);
  await expect(page.getByRole("link", { name: /Laundry Hub/ })).toBeVisible();

  await page.getByRole("group", { name: "Type" }).getByRole("button", { name: "All" }).click();
  await page.getByRole("group", { name: "Category" }).getByRole("button", { name: "All" }).click();
  await page.getByRole("searchbox", { name: "Search projects" }).fill("inventory");
  await expect(cards(page)).toHaveCount(1);
  await expect(page.getByRole("link", { name: /StockWise/ })).toBeVisible();
});

test("filter rows are translated", async ({ page }) => {
  await page.goto("/id/projects");

  await expect(page.getByRole("group", { name: "Tipe" })).toBeVisible();
  await expect(
    page.getByRole("group", { name: "Kategori" }).getByRole("button", { name: "Proyek Pribadi" }),
  ).toBeVisible();
});

test("short pages show the end marker without a back-to-top button", async ({ page, isMobile }) => {
  test.skip(isMobile, "The phone viewport makes even short pages scrollable.");
  await page.goto("/en/unknown-page");

  await expect(page.getByText("You've reached the end")).toBeVisible();
  await expect(page.getByRole("button", { name: "Back to top" })).toHaveCount(0);
});

test("every page ends with an end-of-page marker", async ({ page }) => {
  await page.goto("/en/projects");

  await page.getByText("You've reached the end").scrollIntoViewIfNeeded();
  await expect(page.getByText("You've reached the end")).toBeVisible();
  await expect(page.getByRole("button", { name: "Back to top" })).toBeVisible();
});

test("no results shows a reset button", async ({ page }) => {
  await page.goto("/en/projects");

  await page.getByRole("searchbox", { name: "Search projects" }).fill("zzz-nothing");
  await expect(page.getByText("No projects match your search")).toBeVisible();

  await page.getByRole("button", { name: "Reset" }).click();
  await expect(cards(page)).toHaveCount(5);
});

test("project detail shows the case study and hides empty sections", async ({ page }) => {
  await page.goto("/en/projects/pokeatlas");

  await expect(page.getByRole("heading", { level: 1, name: "PokeAtlas" })).toBeVisible();
  for (const heading of ["Overview", "Problem", "Solution", "Key features", "Tech stack"]) {
    await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
  }

  await page.goto("/en/projects/stockwise");
  await expect(page.getByRole("heading", { level: 2, name: "Key features" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Problem" })).toHaveCount(0);
});

test("only existing links are shown", async ({ page }) => {
  await page.goto("/en/projects/portfolio");

  await expect(page.getByRole("link", { name: /Source code/ })).toHaveAttribute(
    "href",
    "https://github.com/DoniiAdityaa/portofolio-doni",
  );
  await expect(page.getByRole("link", { name: /Live demo/ })).toHaveCount(0);
});

test("gallery opens a lightbox with arrow-key navigation", async ({ page }) => {
  await page.goto("/en/projects/pokeatlas");

  await page.getByRole("button", { name: "Open image: Pokédex list" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("1 of 4")).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByText("2 of 4")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("unpublished or unknown slugs show the not-found page", async ({ page }) => {
  await page.goto("/en/projects/does-not-exist");

  await expect(page.getByText("Page not found")).toBeVisible();
  // Search engines must not index it, whether the 404 is served directly or streamed.
  await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
});
