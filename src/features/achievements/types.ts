import type { ContentRow } from "@/lib/content/types";
import type { LocalizedText } from "@/lib/i18n/localize";

export type AchievementType = "certificate" | "award";

/** `achievement_categories` row, e.g. Mobile, Web, Cloud. */
export type AchievementCategory = {
  id: string;
  name: LocalizedText;
  sortOrder: number;
};

/** `achievements` row plus its `achievement_skills` ids (Case 02 §7.2). */
export type Achievement = ContentRow & {
  title: LocalizedText;
  type: AchievementType;
  imagePath: string | null;
  issuer: string;
  /** ISO date (yyyy-mm-dd). */
  issuedAt: string;
  expiresAt: string | null;
  credentialUrl: string | null;
  credentialId: string | null;
  categoryId: string | null;
  description: LocalizedText;
  skillIds: string[];
};
