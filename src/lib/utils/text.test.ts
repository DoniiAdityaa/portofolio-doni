import { describe, expect, it } from "vitest";

import { splitLines } from "./text";

describe("splitLines", () => {
  it("returns trimmed, non-empty lines", () => {
    expect(splitLines("  First \n\n Second\n   \nThird")).toEqual(["First", "Second", "Third"]);
  });

  it("returns an empty list for empty text", () => {
    expect(splitLines("")).toEqual([]);
  });
});
