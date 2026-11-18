import { GraduationCapIcon, SchoolIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { SectionHeader } from "@/components/layout/section-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { OrgLogo } from "@/components/ui/org-logo";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { formatPeriod } from "@/lib/i18n/dates";
import { localize } from "@/lib/i18n/localize";

import { getPublishedEducations } from "../queries";

/** Education timeline (Case 01 §5.2): newest first. Hidden when empty. */
export async function EducationSection() {
  const [educations, locale, t, tCommon] = await Promise.all([
    getPublishedEducations(),
    getLocale(),
    getTranslations("about.education"),
    getTranslations("common"),
  ]);

  if (educations.length === 0) return null;

  return (
    <section aria-labelledby="education-title" className="space-y-6">
      <Reveal>
        <SectionHeader
          id="education-title"
          icon={GraduationCapIcon}
          title={t("title")}
          description={t("description")}
        />
      </Reveal>
      <RevealGroup>
        <Timeline>
          {educations.map((item) => {
            const notes = localize(item.notes, locale);
            return (
              <RevealItem key={item.id} as="li">
                <TimelineItem
                  title={item.institution}
                  subtitle={localize(item.degree, locale)}
                  period={formatPeriod(
                    item.startDate,
                    item.endDate,
                    locale,
                    tCommon("present"),
                    "year",
                  )}
                  media={
                    <OrgLogo
                      src={item.logoPath}
                      name={item.institution}
                      fallbackIcon={SchoolIcon}
                    />
                  }
                >
                  {notes ? <p>{notes}</p> : null}
                </TimelineItem>
              </RevealItem>
            );
          })}
        </Timeline>
      </RevealGroup>
    </section>
  );
}
