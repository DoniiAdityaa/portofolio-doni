import { ArrowUpRightIcon, BookMarkedIcon, GitForkIcon, StarIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";

import type { PinnedRepository } from "../types";

/** Repositories pinned on the owner's GitHub profile (Case 01 §5.5). */
export async function PinnedRepositories({ repositories }: { repositories: PinnedRepository[] }) {
  const t = await getTranslations("dashboard");

  return (
    <RevealGroup className="grid gap-4 sm:grid-cols-2">
      {repositories.map((repo) => (
        <RevealItem key={repo.name} className="h-full">
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="group block h-full rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <SpotlightCard className="flex h-full flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="flex items-center gap-2 font-mono text-sm font-medium text-primary">
                  <BookMarkedIcon aria-hidden="true" className="size-4 shrink-0" />
                  {repo.name}
                </p>
                <ArrowUpRightIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                />
              </div>
              {repo.description ? (
                <p className="line-clamp-2 text-sm text-muted-foreground">{repo.description}</p>
              ) : null}
              <div className="mt-auto flex items-center gap-4 text-xs text-muted-foreground">
                {repo.language ? (
                  <span className="flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: repo.language.color }}
                    />
                    {repo.language.name}
                  </span>
                ) : null}
                <span className="flex items-center gap-1" title={t("stars")}>
                  <StarIcon
                    aria-hidden="true"
                    className="size-3.5 transition-colors group-hover:fill-amber group-hover:text-amber"
                  />
                  <span className="sr-only">{t("stars")}:</span>
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1" title={t("forks")}>
                  <GitForkIcon aria-hidden="true" className="size-3.5" />
                  <span className="sr-only">{t("forks")}:</span>
                  {repo.forks}
                </span>
              </div>
            </SpotlightCard>
          </a>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
