import { describe, expect, it } from "vitest";

import { isActiveNavItem, NAV_ITEMS } from "./nav-items";

const [home, , , projects] = NAV_ITEMS;

describe("isActiveNavItem", () => {
  it("marks Home active only on the home page", () => {
    expect(isActiveNavItem(home!, "/")).toBe(true);
    expect(isActiveNavItem(home!, "/projects")).toBe(false);
  });

  it("marks a section active on its page and its sub-pages", () => {
    expect(isActiveNavItem(projects!, "/projects")).toBe(true);
    expect(isActiveNavItem(projects!, "/projects/pokeatlas")).toBe(true);
  });

  it("does not match pages that only share a prefix", () => {
    expect(isActiveNavItem(projects!, "/projects-archive")).toBe(false);
  });
});
