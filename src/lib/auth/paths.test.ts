import { describe, expect, it } from "vitest";

import { ADMIN_HOME_PATH, safeAdminRedirect } from "./paths";

describe("safeAdminRedirect", () => {
  it("keeps admin paths", () => {
    expect(safeAdminRedirect("/admin")).toBe("/admin");
    expect(safeAdminRedirect("/admin/projects")).toBe("/admin/projects");
  });

  it("falls back to the admin home for anything else", () => {
    for (const next of [
      null,
      "",
      "/en",
      "/admin/login",
      "/administrator",
      "https://evil.example",
      "//evil.example",
      "/admin//evil.example",
      "/admin/\\evil.example",
    ]) {
      expect(safeAdminRedirect(next)).toBe(ADMIN_HOME_PATH);
    }
  });
});
