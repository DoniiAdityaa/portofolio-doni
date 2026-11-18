"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

import { monthsBetween, splitMonths, todayIso } from "@/lib/i18n/dates";

type DurationLabelProps = {
  start: string;
  /** `null` for ongoing jobs: the length is then measured up to today, in the browser. */
  end: string | null;
};

function subscribeToNothing() {
  return () => {};
}

function getServerToday(): string | null {
  return null;
}

/**
 * Length of a job, e.g. "1 yr 2 mos". Ongoing jobs are measured in the browser,
 * so the prerendered page never depends on the build date.
 */
export function DurationLabel({ start, end }: DurationLabelProps) {
  const t = useTranslations("about.duration");
  // `null` while prerendering on the server, today's date once in the browser.
  const today = useSyncExternalStore(subscribeToNothing, todayIso, getServerToday);

  const until = end ?? today;
  if (!until) return null;

  const { years, months } = splitMonths(monthsBetween(start, until));
  const parts = [
    years > 0 ? t("years", { count: years }) : null,
    months > 0 ? t("months", { count: months }) : null,
  ].filter(Boolean);

  return <span>{parts.join(" ")}</span>;
}
