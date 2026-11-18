import { getLocale, getTranslations } from "next-intl/server";

import { formatDay, formatMonthName } from "@/lib/i18n/dates";

import { getContributionLevel, groupIntoWeeks } from "../contribution-levels";
import type { ContributionLevel } from "../contribution-levels";
import type { ContributionDay } from "../types";

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const LABEL_WIDTH = 28;
const HEADER_HEIGHT = 16;

/** Teal → Sky shades instead of GitHub green (Case 01 §3.5). */
const LEVEL_FILL: Record<ContributionLevel, string> = {
  0: "var(--secondary)",
  1: "color-mix(in oklab, var(--teal) 30%, var(--secondary))",
  2: "color-mix(in oklab, var(--teal) 60%, var(--secondary))",
  3: "color-mix(in oklab, var(--sky) 75%, var(--secondary))",
  4: "var(--sky)",
};

/**
 * GitHub-style contribution calendar for the past year, drawn as one SVG.
 * Cells pop in column by column; each cell has a native tooltip with its date and count.
 */
export async function ContributionGraph({ days }: { days: ContributionDay[] }) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("dashboard")]);
  const weeks = groupIntoWeeks(days);
  const maxCount = Math.max(0, ...days.map((day) => day.count));
  const width = LABEL_WIDTH + weeks.length * STEP;
  const height = HEADER_HEIGHT + 7 * STEP;

  const weekdayFormat = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
  const weekdayLabels = [1, 3, 5].map((weekday) => ({
    row: weekday,
    // 4 Jan 1970 was a Sunday, so day `weekday` after it has that weekday.
    label: weekdayFormat.format(new Date(Date.UTC(1970, 0, 4 + weekday))),
  }));

  const monthLabels = weeks.flatMap((week, index) => {
    const first = week[0];
    const previous = weeks[index - 1]?.[0];
    if (!first || (previous && previous.date.slice(5, 7) === first.date.slice(5, 7))) return [];
    return [{ x: LABEL_WIDTH + index * STEP, label: formatMonthName(first.date, locale) }];
  });

  return (
    <div className="space-y-3">
      {/* Focusable, so keyboard users can scroll it on small screens. */}
      <div
        role="region"
        aria-label={t("graphLabel")}
        tabIndex={0}
        className="overflow-x-auto rounded-md pb-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <svg
          role="img"
          aria-label={t("graphLabel")}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          className="min-w-full"
        >
          {monthLabels.map((month) => (
            <text
              key={`${month.x}`}
              x={month.x}
              y={10}
              className="fill-muted-foreground text-[9px]"
            >
              {month.label}
            </text>
          ))}
          {weekdayLabels.map((weekday) => (
            <text
              key={weekday.row}
              x={0}
              y={HEADER_HEIGHT + weekday.row * STEP + CELL - 2}
              className="fill-muted-foreground text-[9px]"
            >
              {weekday.label}
            </text>
          ))}
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const level = getContributionLevel(day.count, maxCount);
              return (
                <rect
                  key={day.date}
                  x={LABEL_WIDTH + weekIndex * STEP}
                  y={HEADER_HEIGHT + dayIndex * STEP}
                  width={CELL}
                  height={CELL}
                  rx={2.5}
                  fill={LEVEL_FILL[level]}
                  className="origin-center transition-[stroke] [transform-box:fill-box] hover:stroke-foreground hover:stroke-1"
                  style={{
                    animation: `cell-in 0.35s ease-out ${weekIndex * 14}ms both`,
                  }}
                >
                  <title>
                    {t("cellTooltip", {
                      count: day.count,
                      date: formatDay(day.date, locale),
                    })}
                  </title>
                </rect>
              );
            }),
          )}
        </svg>
      </div>
      <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
        <span>{t("less")}</span>
        {([0, 1, 2, 3, 4] as const).map((level) => (
          <span
            key={level}
            aria-hidden="true"
            className="size-[11px] rounded-[2.5px]"
            style={{ backgroundColor: LEVEL_FILL[level] }}
          />
        ))}
        <span>{t("more")}</span>
      </div>
    </div>
  );
}
