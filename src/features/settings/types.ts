import type { LocalizedText } from "@/lib/i18n/localize";

export type SocialPlatform = "github" | "linkedin" | "instagram" | "x" | "tiktok" | "email";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
};

/** The single `site_settings` row (Case 02 §7.2). */
export type SiteSettings = {
  name: string;
  headline: LocalizedText;
  shortIntro: LocalizedText;
  socialLinks: SocialLink[];
  githubUsername: string | null;
};
