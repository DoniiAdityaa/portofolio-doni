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
import { splitLines } from "@/lib/utils/text";

import { getPublishedExperiences } from "../queries";
import { CareerDetails } from "./career-details";
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

  const detailLabels = {
    responsibilities: t("responsibilities"),
    learned: t("learned"),
    impact: t("impact"),
    techUsed: t("techUsed"),
  };

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
            const responsibilities = splitLines(localize(item.responsibilities, locale));
            const learnings = splitLines(localize(item.learnings, locale));
            const impact = splitLines(localize(item.impact, locale));
            const hasDetails =
              responsibilities.length + learnings.length + impact.length > 0 ||
              item.techStack.length > 0;

            return (
              <RevealItem key={item.id} as="li">
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
                  {hasDetails ? (
                    <Expandable showLabel={t("showDetails")} hideLabel={t("hideDetails")}>
                      <CareerDetails
                        labels={detailLabels}
                        responsibilities={responsibilities}
                        learnings={learnings}
                        impact={impact}
                        techStack={
                          item.techStack.length > 0 ? (
                            <ul className="flex flex-wrap gap-2">
                              {item.techStack.map((skill) => (
                                <li key={skill.id}>
                                  <SkillIcon slug={skill.iconSlug} name={skill.name} />
                                </li>
                              ))}
                            </ul>
                          ) : undefined
                        }
                      />
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
