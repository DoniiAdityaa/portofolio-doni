import { CodeIcon, GitGraphIcon, PinIcon } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { BrandIcon, findBrandIcon } from "@/components/ui/brand-icon";
import { EmptyState } from "@/components/ui/empty-state";
import { Separator } from "@/components/ui/separator";
import { ContributionGraph } from "@/features/github/components/contribution-graph";
import { PinnedRepositories } from "@/features/github/components/pinned-repositories";
import { TopLanguages } from "@/features/github/components/top-languages";
import { getGithubSnapshot } from "@/features/github/queries";
import { formatDay } from "@/lib/i18n/dates";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("dashboard") };
}

/** Dashboard (Case 01 §5.5): GitHub contributions, pinned repositories, and top languages. */
export default async function DashboardPage() {
  const [snapshot, locale, t, tNav, tPages] = await Promise.all([
    getGithubSnapshot(),
    getLocale(),
    getTranslations("dashboard"),
    getTranslations("nav"),
    getTranslations("pages"),
  ]);
  const githubIcon = findBrandIcon("github");

  return (
    <div className="space-y-12">
      <PageHeader title={tNav("dashboard")} description={tPages("dashboard.description")} />

      {snapshot === null ? (
        <EmptyState
          icon={GitGraphIcon}
          title={t("unavailableTitle")}
          description={t("unavailableDescription")}
        />
      ) : (
        <>
          <section aria-labelledby="github-title" className="space-y-5">
            <Reveal>
              <SectionHeader
                id="github-title"
                icon={GitGraphIcon}
                title={t("github.title")}
                description={t("github.description")}
                action={
                  <a
                    href={`https://github.com/${snapshot.username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {githubIcon ? <BrandIcon icon={githubIcon} className="size-4" /> : null}@
                    {snapshot.username}
                    <span className="sr-only">({t("viewProfile")})</span>
                  </a>
                }
              />
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-sm">
                <span className="font-heading text-2xl font-semibold text-primary">
                  {snapshot.totalContributions.toLocaleString(locale)}
                </span>{" "}
                <span className="text-muted-foreground">
                  {t("totalLabel", { count: snapshot.totalContributions })}
                </span>
              </p>
            </Reveal>
            <div className="rounded-xl border bg-card p-4">
              <ContributionGraph days={snapshot.contributions} />
            </div>
            <p className="text-xs text-muted-foreground">
              {t("lastUpdated", { date: formatDay(snapshot.fetchedAt.slice(0, 10), locale) })}
            </p>
          </section>

          {snapshot.pinnedRepositories.length > 0 ? (
            <>
              <Separator />
              <section aria-labelledby="pinned-title" className="space-y-5">
                <Reveal>
                  <SectionHeader
                    id="pinned-title"
                    icon={PinIcon}
                    title={t("pinned.title")}
                    description={t("pinned.description")}
                  />
                </Reveal>
                <PinnedRepositories repositories={snapshot.pinnedRepositories} />
              </section>
            </>
          ) : null}

          {snapshot.languages.length > 0 ? (
            <>
              <Separator />
              <section aria-labelledby="languages-title" className="space-y-5">
                <Reveal>
                  <SectionHeader
                    id="languages-title"
                    icon={CodeIcon}
                    title={t("languages.title")}
                    description={t("languages.description")}
                  />
                </Reveal>
                <Reveal delay={0.05}>
                  <TopLanguages languages={snapshot.languages} />
                </Reveal>
              </section>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
