import { getLocale, getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";
import { Signature } from "@/components/motion/signature";
import type { SiteSettings } from "@/features/settings/types";
import { localize } from "@/lib/i18n/localize";

/** The owner's full story (Case 01 §5.2), one paragraph per blank-line-separated block. */
export async function AboutIntro({ settings }: { settings: SiteSettings }) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("about.intro")]);
  const paragraphs = localize(settings.fullIntro, locale)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return null;

  return (
    <section aria-label={t("title")} className="space-y-4 leading-relaxed text-muted-foreground">
      {paragraphs.map((paragraph, index) => (
        <Reveal key={index} delay={index * 0.08}>
          <p>{paragraph}</p>
        </Reveal>
      ))}
      <Reveal delay={paragraphs.length * 0.08}>
        <p className="pt-2">
          {t("signature")}
          <span className="mt-3 block">
            <Signature name={settings.name} />
          </span>
        </p>
      </Reveal>
    </section>
  );
}
