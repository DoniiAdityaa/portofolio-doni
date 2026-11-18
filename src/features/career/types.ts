import type { ContentRow } from "@/lib/content/types";
import type { LocalizedText } from "@/lib/i18n/localize";

export type ExperienceType = "full_time" | "internship" | "freelance" | "contract";

/** `experiences` row plus its optional `experience_skills` ids (Case 02 §7.2). */
export type Experience = ContentRow & {
  company: string;
  logoPath: string | null;
  position: LocalizedText;
  type: ExperienceType;
  /** ISO date (yyyy-mm-dd). */
  startDate: string;
  /** ISO date, or `null` while the job is ongoing ("Present"). */
  endDate: string | null;
  /** One item per line (CR-04). */
  responsibilities: LocalizedText;
  /** What the owner learned; one item per line (CR-04). */
  learnings: LocalizedText;
  /** Results and impact; one item per line (CR-04). */
  impact: LocalizedText;
  skillIds: string[];
};
