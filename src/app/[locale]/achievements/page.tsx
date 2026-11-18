import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ComingSoonPage } from "@/components/layout/coming-soon-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("achievements") };
}

// Placeholder until M2 builds the real page.
export default function AchievementsPage() {
  return <ComingSoonPage page="achievements" />;
}
