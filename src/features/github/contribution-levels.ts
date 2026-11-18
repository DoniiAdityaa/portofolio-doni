import type { ContributionDay } from "./types";

/** Five shades, from no activity (0) to the busiest days (4), like GitHub's calendar. */
export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

/**
 * Maps a day's count to a level using the year's busiest day as the scale,
 * so a quiet year and a busy year both use the full range of shades.
 */
export function getContributionLevel(count: number, maxCount: number): ContributionLevel {
  if (count <= 0 || maxCount <= 0) return 0;
  const ratio = count / maxCount;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

/** Splits days (oldest first, starting on a Sunday) into week columns of seven days. */
export function groupIntoWeeks(days: ContributionDay[]): ContributionDay[][] {
  const weeks: ContributionDay[][] = [];
  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }
  return weeks;
}
