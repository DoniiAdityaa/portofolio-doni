import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { Separator } from "@/components/ui/separator";
import { AboutIntro } from "@/features/about/components/about-intro";
import { CareerSection } from "@/features/career/components/career-section";
import { EducationSection } from "@/features/education/components/education-section";
import { getSiteSettings } from "@/features/settings/queries";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("about") };
}

/** About (Case 01 §5.2): full introduction → career timeline → education timeline. */
export default async function AboutPage() {
  const [settings, tNav, tPages] = await Promise.all([
    getSiteSettings(),
    getTranslations("nav"),
    getTranslations("pages"),
  ]);

  return (
    <div className="space-y-12">
      <PageHeader title={tNav("about")} description={tPages("about.description")} />
      <AboutIntro settings={settings} />
      <Separator />
      <CareerSection />
      <Separator />
      <EducationSection />
    </div>
  );
}
