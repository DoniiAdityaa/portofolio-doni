import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PUBLIC_PAGES = [
  "/en",
  "/en/about",
  "/en/achievements",
  "/en/projects",
  "/en/projects/pokeatlas",
  "/en/dashboard",
  "/en/contact",
  "/id",
];

/** Automated accessibility check (Case 03 M7): no serious or critical axe violations. */
for (const path of PUBLIC_PAGES) {
  test(`${path} has no serious accessibility issues`, async ({ page }) => {
    // Reduced motion shows everything at once, so no element is checked mid-fade.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    // Scroll through once so scroll-triggered entrances run, then let them finish.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(800);

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = violations
      .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
      .map(
        (violation) =>
          `${violation.id}: ${violation.help} → ${violation.nodes
            .slice(0, 3)
            .map((node) => node.target.join(" "))
            .join(" | ")}`,
      );

    expect(serious).toEqual([]);
  });
}
