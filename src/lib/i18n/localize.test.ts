import { describe, expect, it } from "vitest";

import { localize } from "./localize";

describe("localize", () => {
  it("returns the text for the active locale", () => {
    const field = { en: "Projects", id: "Proyek" };

    expect(localize(field, "en")).toBe("Projects");
    expect(localize(field, "id")).toBe("Proyek");
  });

  it("falls back to the other language when the active one is empty", () => {
    expect(localize({ en: "Only English", id: "" }, "id")).toBe("Only English");
    expect(localize({ en: null, id: "Hanya Indonesia" }, "en")).toBe("Hanya Indonesia");
    expect(localize({ id: "   ", en: "Trimmed fallback" }, "id")).toBe("Trimmed fallback");
  });

  it("returns an empty string when no language has text", () => {
    expect(localize({ en: "", id: "" }, "en")).toBe("");
    expect(localize({}, "id")).toBe("");
    expect(localize(null, "en")).toBe("");
    expect(localize(undefined, "id")).toBe("");
  });
});
