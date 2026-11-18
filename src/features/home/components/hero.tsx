import { ArrowRightIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { DownloadCvButton } from "@/components/layout/download-cv-button";
import { Reveal } from "@/components/motion/reveal";
import { Typewriter } from "@/components/motion/typewriter";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/features/settings/types";
import { localize } from "@/lib/i18n/localize";
import { Link } from "@/lib/i18n/navigation";

/** Home hero (Case 01 §5.1): greeting, typed headline, short intro, and calls to action. */
export async function Hero({ settings }: { settings: SiteSettings }) {
  const t = await getTranslations("home");
  const locale = await getLocale();

  return (
    <section aria-labelledby="hero-title" className="space-y-6">
      <div className="space-y-3">
        <Reveal>
          <h1 id="hero-title" className="text-4xl font-semibold sm:text-5xl">
            {t("greeting", { name: settings.name })}
          </h1>
        </Reveal>
        <p className="font-mono text-lg text-primary sm:text-xl">
          <Typewriter text={localize(settings.headline, locale)} startDelay={500} />
        </p>
      </div>

      <Reveal delay={0.15}>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          {localize(settings.shortIntro, locale)}
        </p>
      </Reveal>

      <Reveal delay={0.25} className="flex flex-wrap gap-3">
        <DownloadCvButton />
        <Button asChild variant="outline" size="lg" className="group">
          <Link href="/projects">
            {t("viewProjects")}
            <ArrowRightIcon
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Button>
      </Reveal>
    </section>
  );
}
