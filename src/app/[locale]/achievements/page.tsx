import { TrophyIcon } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { AchievementCard } from "@/features/achievements/components/achievement-card";
import { AchievementFilter } from "@/features/achievements/components/achievement-filter";
import {
  getPublishedAchievements,
  getUsedAchievementCategories,
} from "@/features/achievements/queries";
import { localize } from "@/lib/i18n/localize";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("achievements") };
}

/** Achievement (Case 01 §5.3): certificates and awards with filters and a lightbox. */
export default async function AchievementsPage() {
  const [achievements, categories, locale, tNav, tPages] = await Promise.all([
    getPublishedAchievements(),
    getUsedAchievementCategories(),
    getLocale(),
    getTranslations("nav"),
    getTranslations("pages"),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader title={tNav("achievements")} description={tPages("achievements.description")} />
      {achievements.length === 0 ? (
        <EmptyState icon={TrophyIcon} title={tPages("comingSoonTitle")} />
      ) : (
        <Reveal>
          <AchievementFilter
            categories={categories.map((category) => ({
              id: category.id,
              label: localize(category.name, locale),
            }))}
            items={achievements.map((item) => ({
              id: item.id,
              type: item.type,
              categoryId: item.categoryId,
              searchText: `${localize(item.title, locale)} ${item.issuer}`.toLowerCase(),
              node: <AchievementCard item={item} />,
            }))}
          />
        </Reveal>
      )}
    </div>
  );
}
