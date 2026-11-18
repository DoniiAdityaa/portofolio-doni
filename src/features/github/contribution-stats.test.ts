import { describe, expect, it } from "vitest";

import { computeContributionStats } from "./contribution-stats";

const day = (count: number, index: number) => ({ date: `2026-01-${index + 1}`, count });

describe("computeContributionStats", () => {
  it("sums totals, the last seven days, and finds the best day", () => {
    const counts = [5, 0, 0, 1, 2, 3, 0, 4, 10];
    const stats = computeContributionStats(counts.map(day));

    expect(stats.total).toBe(25);
    expect(stats.thisWeek).toBe(20); // last seven: 0,1,2,3,0,4,10
    expect(stats.bestDay).toBe(10);
    expect(stats.dailyAverage).toBe(2.8);
  });

  it("handles an empty calendar", () => {
    expect(computeContributionStats([])).toEqual({
      total: 0,
      thisWeek: 0,
      bestDay: 0,
      dailyAverage: 0,
    });
  });
});
