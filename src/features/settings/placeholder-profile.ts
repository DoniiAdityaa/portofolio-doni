/**
 * Temporary profile used by the layout shell until Site Settings exist.
 * M2 moves this behind `features/settings/queries.ts`; M5 reads it from Supabase.
 */
export type SocialPlatform = "github" | "linkedin" | "instagram" | "x" | "tiktok" | "email";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
};

export type ProfileSummary = {
  name: string;
  initials: string;
  socialLinks: SocialLink[];
};

export const placeholderProfile: ProfileSummary = {
  name: "Doni",
  initials: "D",
  socialLinks: [{ platform: "github", url: "https://github.com/DoniiAdityaa" }],
};
