import { expect, test } from "@playwright/test";

test("About shows the intro, then career, then education", async ({ page }) => {
  await page.goto("/en/about");

  await expect(page.getByRole("heading", { level: 1, name: "About" })).toBeVisible();
  await expect(page.getByText(/I'm Doni, a mobile developer/)).toBeVisible();

  const headings = page.getByRole("heading", { level: 2 });
  await expect(headings).toHaveText(["Career", "Education"]);
});

test("career lists published internships only and expands details", async ({ page }) => {
  await page.goto("/en/about");
  const career = page.getByRole("region", { name: "Career" });

  await expect(career.getByRole("heading", { level: 3 })).toHaveText([
    "Mobile Developer Intern",
    "Web Developer Intern",
  ]);
  await expect(career.getByText("Internship")).toHaveCount(2);
  // The full-time entry is a draft and must stay hidden.
  await expect(page.getByText("Earlier Company")).toHaveCount(0);

  await career.getByRole("button", { name: "Show details" }).first().click();
  await expect(career.getByText(/Built and shipped Flutter features/)).toBeVisible();
  await expect(career.getByRole("button", { name: "Hide details" })).toBeVisible();
});

test("About is translated into Indonesian", async ({ page }) => {
  await page.goto("/id/about");

  await expect(page.getByRole("heading", { level: 1, name: "Tentang" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Karier" })).toBeVisible();
  await expect(page.getByText("Magang")).toHaveCount(2);
  await expect(page.getByText(/– Sekarang/)).toBeVisible();
});
