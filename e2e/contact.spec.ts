import { expect, type Page, test } from "@playwright/test";

import { ADMIN_STORAGE_STATE } from "./support/admin";
import { newVisitorPage } from "./support/visitor";

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

async function sendMessage(page: Page, message: string) {
  await page.goto("/en/contact");
  await form(page).getByLabel("Name").fill("E2E Visitor");
  await form(page).getByLabel("Email").fill("visitor@example.com");
  await form(page).getByLabel("Message").fill(message);
  await page.getByRole("button", { name: "Send message" }).click();
}

test("a valid message is sent and the form clears", async ({ browser }) => {
  const page = await newVisitorPage(browser);
  await sendMessage(page, "Hello! I'd like to talk about a Flutter project.");

  await expect(page.getByRole("status")).toContainText("Your message was sent");
  await expect(form(page).getByLabel("Name")).toHaveValue("");
});

test.describe("admin inbox", () => {
  test.use({ storageState: ADMIN_STORAGE_STATE });

  test("a sent message appears in the admin inbox", async ({ browser, page }) => {
    const text = `Inbox check ${Date.now()}: please call me about an app.`;
    const visitor = await newVisitorPage(browser);
    await sendMessage(visitor, text);
    await expect(visitor.getByRole("status")).toContainText("Your message was sent");

    await page.goto("/admin/inbox");
    await expect(page.getByText(text).first()).toBeVisible();
  });
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
