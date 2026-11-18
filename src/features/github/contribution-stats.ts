import type { ContributionDay } from "./types";

export type ContributionStats = {
  total: number;
  /** Contributions in the last seven days of the calendar. */
  thisWeek: number;
  /** The highest single-day count. */
  bestDay: number;
  /** Average per day across the calendar, rounded to one decimal. */
  dailyAverage: number;
};

/** Summary numbers shown above the contribution calendar (CR-07). */
export function computeContributionStats(days: ContributionDay[]): ContributionStats {
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const thisWeek = days.slice(-7).reduce((sum, day) => sum + day.count, 0);
  const bestDay = days.reduce((best, day) => Math.max(best, day.count), 0);
  const dailyAverage = days.length > 0 ? Math.round((total / days.length) * 10) / 10 : 0;

  return { total, thisWeek, bestDay, dailyAverage };
}
