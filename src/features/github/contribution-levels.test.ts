import { describe, expect, it } from "vitest";

import { getContributionLevel, groupIntoWeeks } from "./contribution-levels";

describe("getContributionLevel", () => {
  it("returns 0 for days without contributions", () => {
    expect(getContributionLevel(0, 10)).toBe(0);
    expect(getContributionLevel(5, 0)).toBe(0);
  });

  it("scales levels against the busiest day", () => {
    expect(getContributionLevel(1, 20)).toBe(1);
    expect(getContributionLevel(8, 20)).toBe(2);
    expect(getContributionLevel(12, 20)).toBe(3);
    expect(getContributionLevel(20, 20)).toBe(4);
  });
});

describe("groupIntoWeeks", () => {
  it("splits days into columns of seven", () => {
    const days = Array.from({ length: 14 }, (_, i) => ({ date: `d${i}`, count: i }));
    const weeks = groupIntoWeeks(days);

    expect(weeks).toHaveLength(2);
    expect(weeks[1]?.[0]?.date).toBe("d7");
  });
});
