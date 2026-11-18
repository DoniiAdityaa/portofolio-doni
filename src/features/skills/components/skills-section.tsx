import { LayersIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { SkillIcon } from "@/components/ui/skill-icon";
import { localize } from "@/lib/i18n/localize";

import { getSkillGroups } from "../queries";
import { SkillFilter } from "./skill-filter";

/** Home skills section: icons grouped by category (Case 01 §5.1). Hidden when empty. */
export async function SkillsSection() {
  const [groups, t, locale] = await Promise.all([
    getSkillGroups(),
    getTranslations("home.skills"),
    getLocale(),
  ]);

  if (groups.length === 0) return null;

  const tabs = groups.map(({ category }) => ({
    id: category.id,
    label: localize(category.name, locale),
  }));
  const chips = groups.flatMap(({ skills }) =>
    skills.map((skill) => ({
      id: skill.id,
      categoryId: skill.categoryId,
      node: <SkillIcon slug={skill.iconSlug} name={skill.name} />,
    })),
  );

  return (
    <section aria-labelledby="skills-title" className="space-y-6">
      <Reveal>
        <SectionHeader
          id="skills-title"
          icon={LayersIcon}
          title={t("title")}
          description={t("description")}
        />
      </Reveal>
      <Reveal delay={0.1}>
        <SkillFilter allLabel={t("all")} filterLabel={t("filterLabel")} tabs={tabs} chips={chips} />
      </Reveal>
    </section>
  );
}
