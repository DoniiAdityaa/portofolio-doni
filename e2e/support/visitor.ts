import { randomUUID } from "node:crypto";

import type { Browser, Page } from "@playwright/test";

/**
 * A page for a fresh visitor with its own user agent. Real browsers are counted as
 * visitors (headless ones look like bots), and a unique agent gives each test its own
 * rate-limit budget.
 */
export async function newVisitorPage(browser: Browser): Promise<Page> {
  const context = await browser.newContext({
    userAgent: `Mozilla/5.0 (E2E visitor ${randomUUID()}) Chrome/140`,
  });
  return context.newPage();
}
