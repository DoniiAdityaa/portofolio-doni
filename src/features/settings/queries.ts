import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import { CACHE_TAGS } from "@/lib/cache/tags";
import { storedText } from "@/lib/content/stored";
import { createSupabasePublicClient } from "@/lib/supabase/public";

import type { SiteSettings, SocialPlatform } from "./types";

const SOCIAL_PLATFORMS: readonly SocialPlatform[] = [
  "github",
  "linkedin",
  "instagram",
  "x",
  "tiktok",
  "email",
];

const storedSocialLinks = z
  .array(z.object({ platform: z.enum(SOCIAL_PLATFORMS), url: z.string() }))
  .catch([]);
const storedRoles = z.array(z.unknown()).catch([]);

const EMPTY_SETTINGS: SiteSettings = {
  name: "",
  headline: { en: "", id: "" },
  roles: [],
  shortIntro: { en: "", id: "" },
  fullIntro: { en: "", id: "" },
  socialLinks: [],
  githubUsername: null,
  photoPath: null,
  cvPaths: { en: null, id: null },
};

/** Site-wide profile and settings (the single `site_settings` row), cached until edited. */
export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.settings);

  const { data, error } = await createSupabasePublicClient()
    .from("site_settings")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  if (!data) return EMPTY_SETTINGS;

  return {
    name: data.name,
    headline: storedText(data.headline),
    roles: storedRoles.parse(data.roles).map(storedText),
    shortIntro: storedText(data.short_intro),
    fullIntro: storedText(data.full_intro),
    socialLinks: storedSocialLinks.parse(data.social_links),
    githubUsername: data.github_username,
    photoPath: data.photo_path,
    cvPaths: { en: data.cv_en_path, id: data.cv_id_path },
  };
}

/** "Doni Aditya" → "DA"; used while no profile photo exists. */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
