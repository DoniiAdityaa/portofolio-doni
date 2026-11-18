import type { ContentRow } from "@/lib/content/types";
import type { LocalizedText } from "@/lib/i18n/localize";

/** `educations` row (Case 02 §7.2). */
export type Education = ContentRow & {
  institution: string;
  logoPath: string | null;
  degree: LocalizedText;
  /** ISO date (yyyy-mm-dd). */
  startDate: string;
  /** ISO date, or `null` while still studying. */
  endDate: string | null;
  notes: LocalizedText;
};
