import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";
import { Typewriter } from "@/components/motion/typewriter";
import { placeholderProfile } from "@/features/settings/placeholder-profile";

/**
 * Home hero. M2 adds the skills and featured-projects sections below it,
 * with real content from `features/*` queries.
 */
export default async function HomePage() {
  const tHome = await getTranslations("home");
  const tProfile = await getTranslations("profile");

  return (
    <section className="space-y-5">
      <Reveal>
        <p className="font-mono text-sm text-primary">
          {tHome("greeting", { name: placeholderProfile.name })}
        </p>
      </Reveal>
      <h1 className="text-4xl font-semibold sm:text-5xl">
        <Typewriter text={tProfile("role")} />
      </h1>
      <Reveal delay={0.15}>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">{tHome("intro")}</p>
      </Reveal>
    </section>
  );
}
