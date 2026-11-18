import { BriefcaseBusinessIcon, Building2Icon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { SectionHeader } from "@/components/layout/section-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Expandable } from "@/components/ui/expandable";
import { OrgLogo } from "@/components/ui/org-logo";
import { SkillIcon } from "@/components/ui/skill-icon";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { formatPeriod } from "@/lib/i18n/dates";
import { localize } from "@/lib/i18n/localize";

import { getPublishedExperiences } from "../queries";
import { DurationLabel } from "./duration-label";

/** Career timeline (Case 01 §5.2): newest first, internships labeled. Hidden when empty. */
export async function CareerSection() {
  const [experiences, locale, t, tCommon] = await Promise.all([
    getPublishedExperiences(),
    getLocale(),
    getTranslations("about"),
    getTranslations("common"),
  ]);

  if (experiences.length === 0) return null;

  return (
    <section aria-labelledby="career-title" className="space-y-6">
      <Reveal>
        <SectionHeader
          id="career-title"
          icon={BriefcaseBusinessIcon}
          title={t("career.title")}
          description={t("career.description")}
        />
      </Reveal>
      <RevealGroup>
        <Timeline>
          {experiences.map((item) => {
            const highlights = localize(item.description, locale)
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean);

            return (
              <RevealItem key={item.id}>
                <TimelineItem
                  title={localize(item.position, locale)}
                  subtitle={item.company}
                  period={formatPeriod(item.startDate, item.endDate, locale, tCommon("present"))}
                  media={
                    <OrgLogo src={item.logoPath} name={item.company} fallbackIcon={Building2Icon} />
                  }
                  badges={
                    <>
                      <span aria-hidden="true">·</span>
                      <DurationLabel start={item.startDate} end={item.endDate} />
                      <Badge variant="secondary">{t(`type.${item.type}`)}</Badge>
                    </>
                  }
                >
                  {highlights.length > 0 || item.techStack.length > 0 ? (
                    <Expandable showLabel={t("showDetails")} hideLabel={t("hideDetails")}>
                      <div className="space-y-4">
                        {highlights.length > 0 ? (
                          <ul className="list-disc space-y-1.5 pl-4 marker:text-primary">
                            {highlights.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        ) : null}
                        {item.techStack.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-xs font-medium tracking-wide text-foreground uppercase">
                              {t("techUsed")}
                            </p>
                            <ul className="flex flex-wrap gap-2">
                              {item.techStack.map((skill) => (
                                <li key={skill.id}>
                                  <SkillIcon slug={skill.iconSlug} name={skill.name} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </Expandable>
                  ) : null}
                </TimelineItem>
              </RevealItem>
            );
          })}
        </Timeline>
      </RevealGroup>
    </section>
  );
}
