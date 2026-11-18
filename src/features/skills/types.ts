import type { ContentRow } from "@/lib/content/types";
import type { LocalizedText } from "@/lib/i18n/localize";

/** `skill_categories` row, e.g. Mobile, Web, Backend. */
export type SkillCategory = {
  id: string;
  name: LocalizedText;
  sortOrder: number;
};

/** `skills` row. `iconSlug` is a Simple Icons slug picked in admin. */
export type Skill = ContentRow & {
  name: string;
  iconSlug: string;
  categoryId: string;
};

export type SkillGroup = {
  category: SkillCategory;
  skills: Skill[];
};
