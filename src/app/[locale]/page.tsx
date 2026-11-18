import { getTranslations } from "next-intl/server";

import { DesignPreview } from "@/components/layout/design-preview";
import { placeholderProfile } from "@/features/settings/placeholder-profile";

/**
 * Temporary Home page for reviewing the M1 design system.
 * M2 replaces it with the real Home sections (hero, skills, featured projects).
 */
export default async function HomePage() {
  const t = await getTranslations("profile");

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <p className="font-mono text-sm text-primary">Hi, I&apos;m {placeholderProfile.name} 👋</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">{t("role")}</h1>
        <p className="max-w-2xl text-muted-foreground">
          Design system preview for Milestone 1. Real content arrives in Milestone 2.
        </p>
      </header>
      <DesignPreview />
    </div>
  );
}
