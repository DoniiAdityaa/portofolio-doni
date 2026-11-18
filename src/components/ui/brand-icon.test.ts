import { describe, expect, it } from "vitest";

import { findBrandIcon, readableBrandColor } from "./brand-icon";

describe("findBrandIcon", () => {
  it("finds icons by slug", () => {
    expect(findBrandIcon("flutter")?.title).toBe("Flutter");
    expect(findBrandIcon("nextdotjs")?.title).toBe("Next.js");
  });

  it("returns undefined for unknown slugs", () => {
    expect(findBrandIcon("not-a-real-icon")).toBeUndefined();
  });
});

describe("readableBrandColor", () => {
  it("keeps bright brand colors", () => {
    expect(readableBrandColor("02569B")).toBe("#02569B");
  });

  it("drops colors too dark for the dark background", () => {
    expect(readableBrandColor("000000")).toBeUndefined();
  });
});
