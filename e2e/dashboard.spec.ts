import { expect, test } from "@playwright/test";

test("shows GitHub activity, pinned repositories, and top languages", async ({ page }) => {
  await page.goto("/en/dashboard");

  await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
  for (const heading of ["GitHub activity", "Pinned repositories", "Top languages"]) {
    await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
  }
  for (const stat of ["Followers", "Following", "Repositories", "This week", "Best day"]) {
    await expect(page.getByText(stat, { exact: true })).toBeVisible();
  }
  await expect(page.getByText(/Last updated/)).toBeVisible();
});

test("the contribution calendar covers a full year of weeks", async ({ page }) => {
  await page.goto("/en/dashboard");
  const calendar = page.getByRole("img", { name: "Contribution calendar for the past year" });

  await expect(calendar).toBeVisible();
  await expect(calendar.locator("rect")).toHaveCount(53 * 7);
});

test("pinned repositories link to GitHub in a new tab", async ({ page }) => {
  await page.goto("/en/dashboard");
  const repo = page.getByRole("link", { name: /portofolio-doni/ });

  await expect(repo).toHaveAttribute("href", "https://github.com/DoniiAdityaa/portofolio-doni");
  await expect(repo).toHaveAttribute("target", "_blank");
});

test("Dashboard is translated into Indonesian", async ({ page }) => {
  await page.goto("/id/dashboard");

  await expect(page.getByRole("heading", { level: 2, name: "Aktivitas GitHub" })).toBeVisible();
  await expect(page.getByText("Pengikut", { exact: true })).toBeVisible();
  await expect(page.getByText("Rata-rata harian", { exact: true })).toBeVisible();
});
