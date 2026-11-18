import { getLocale, getTranslations } from "next-intl/server";

import { CountUp } from "@/components/motion/count-up";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";

import type { ContributionStats } from "../contribution-stats";
import type { GithubSnapshot } from "../types";

type StatItem = { key: string; label: string; value: number; decimals?: number; suffix?: string };

/** Profile and contribution summary cards above the calendar (CR-07), counting up on view. */
export async function GithubStats({
  profile,
  stats,
}: {
  profile: GithubSnapshot["profile"];
  stats: ContributionStats;
}) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("dashboard.stats")]);

  const profileStats: StatItem[] = [
    { key: "followers", label: t("followers"), value: profile.followers },
    { key: "following", label: t("following"), value: profile.following },
    { key: "repositories", label: t("repositories"), value: profile.publicRepos },
  ];
  const activityStats: StatItem[] = [
    { key: "contributions", label: t("contributions"), value: stats.total },
    { key: "thisWeek", label: t("thisWeek"), value: stats.thisWeek },
    { key: "bestDay", label: t("bestDay"), value: stats.bestDay },
    {
      key: "dailyAverage",
      label: t("dailyAverage"),
      value: stats.dailyAverage,
      decimals: 1,
      suffix: t("perDay"),
    },
  ];

  return (
    <div className="space-y-3">
      <StatGrid items={profileStats} locale={locale} className="grid-cols-3" />
      <StatGrid items={activityStats} locale={locale} className="grid-cols-2 sm:grid-cols-4" />
    </div>
  );
}

function StatGrid({
  items,
  locale,
  className,
}: {
  items: StatItem[];
  locale: string;
  className: string;
}) {
  return (
    <RevealGroup className={`grid gap-3 ${className}`}>
      {items.map((item) => (
        <RevealItem key={item.key}>
          <SpotlightCard className="flex flex-col items-center gap-1 px-3 py-4 text-center">
            <span className="text-xs text-muted-foreground sm:text-sm">{item.label}</span>
            <span className="font-heading text-2xl font-semibold text-primary sm:text-3xl">
              <CountUp value={item.value} decimals={item.decimals} locale={locale} />
              {item.suffix ? (
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  {item.suffix}
                </span>
              ) : null}
            </span>
          </SpotlightCard>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
