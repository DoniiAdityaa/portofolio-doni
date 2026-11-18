import type { Locale } from "./routing";

/** Reads "yyyy-mm-dd" as a calendar date, avoiding time-zone shifts. */
function parseIsoDate(iso: string): { year: number; month: number } {
  const [year = "0", month = "1"] = iso.split("-");
  return { year: Number(year), month: Number(month) };
}

/** Formats a date as "Jul 2026" (EN) / "Jul 2026" (ID), or just the year. */
export function formatDate(iso: string, locale: Locale, granularity: "month" | "year"): string {
  const { year, month } = parseIsoDate(iso);
  const date = new Date(Date.UTC(year, month - 1, 1));
  const options: Intl.DateTimeFormatOptions =
    granularity === "month"
      ? { month: "short", year: "numeric", timeZone: "UTC" }
      : { year: "numeric", timeZone: "UTC" };
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/** "Jul 2025 – Dec 2025", or "Jul 2026 – Present" when `end` is null. */
export function formatPeriod(
  start: string,
  end: string | null,
  locale: Locale,
  presentLabel: string,
  granularity: "month" | "year" = "month",
): string {
  const from = formatDate(start, locale, granularity);
  const to = end ? formatDate(end, locale, granularity) : presentLabel;
  return `${from} – ${to}`;
}

/** Whole months from `start` to `end`, counting both the first and last month. */
export function monthsBetween(start: string, end: string): number {
  const a = parseIsoDate(start);
  const b = parseIsoDate(end);
  return Math.max(1, (b.year - a.year) * 12 + (b.month - a.month) + 1);
}

/** 14 → { years: 1, months: 2 }. */
export function splitMonths(total: number): { years: number; months: number } {
  return { years: Math.floor(total / 12), months: total % 12 };
}

/** Today as "yyyy-mm-dd" (local time). Only call this in the browser. */
export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
