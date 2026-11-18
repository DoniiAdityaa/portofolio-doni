import { expect, type Page, test } from "@playwright/test";

/** The form only: the sidebar also has an "Email" link. */
const form = (page: Page) => page.getByRole("main").locator("form");

test("shows validation errors and keeps the typed input", async ({ page }) => {
  await page.goto("/en/contact");

  await form(page).getByLabel("Name").fill("D");
  await form(page).getByLabel("Email").fill("not-an-email");
  await form(page).getByLabel("Message").fill("Hi");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Enter at least 2 characters.")).toBeVisible();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByText("Write at least 10 characters.")).toBeVisible();
  await expect(form(page).getByLabel("Email")).toHaveValue("not-an-email");
});

test("a valid message shows the notice and clears the form", async ({ page }) => {
  await page.goto("/en/contact");

  await form(page).getByLabel("Name").fill("Doni");
  await form(page).getByLabel("Email").fill("doni@example.com");
  await form(page).getByLabel("Message").fill("Hello! I'd like to talk about a Flutter project.");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByRole("status")).toContainText("Your message looks good");
  await expect(form(page).getByLabel("Name")).toHaveValue("");
});

test("social profiles are shown as tiles", async ({ page }) => {
  await page.goto("/en/contact");
  const channels = page.getByRole("region", { name: "Find me online" });

  await expect(channels.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
    "href",
    "https://github.com/DoniiAdityaa",
  );
  await expect(channels.getByRole("link", { name: /Email/ })).toHaveAttribute(
    "href",
    "mailto:hello@example.com",
  );
  await expect(channels.getByRole("link")).toHaveCount(6);
});

test("Contact is translated into Indonesian", async ({ page }) => {
  await page.goto("/id/contact");

  await expect(page.getByRole("heading", { level: 1, name: "Kontak" })).toBeVisible();
  await page.getByRole("button", { name: "Kirim pesan" }).click();
  await expect(page.getByText("Masukkan alamat email yang valid.")).toBeVisible();
});
