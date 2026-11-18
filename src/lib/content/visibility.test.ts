import { describe, expect, it } from "vitest";

import { compareByManualOrderThenDate, isPubliclyVisible } from "./visibility";

describe("isPubliclyVisible", () => {
  it("shows only published, non-archived rows", () => {
    expect(isPubliclyVisible({ status: "published", deletedAt: null })).toBe(true);
    expect(isPubliclyVisible({ status: "draft", deletedAt: null })).toBe(false);
    expect(isPubliclyVisible({ status: "published", deletedAt: "2026-01-01" })).toBe(false);
  });
});

describe("compareByManualOrderThenDate", () => {
  const byDate = compareByManualOrderThenDate<{
    id: string;
    sortOrder: number | null;
    date: string;
  }>((item) => item.date);

  it("puts manually ordered items first, then newest first", () => {
    const items = [
      { id: "old", sortOrder: null, date: "2024-01-01" },
      { id: "second", sortOrder: 2, date: "2020-01-01" },
      { id: "new", sortOrder: null, date: "2026-01-01" },
      { id: "first", sortOrder: 1, date: "2019-01-01" },
    ];

    expect(items.sort(byDate).map((item) => item.id)).toEqual(["first", "second", "new", "old"]);
  });
});
