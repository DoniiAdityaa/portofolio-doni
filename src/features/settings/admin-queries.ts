import "server-only";

import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { SiteSettingsFormValues } from "./schema";
import { SOCIAL_PLATFORMS } from "./schema";

const EMPTY_TEXT = { en: "", id: "" };

const storedText = z.object({ en: z.string(), id: z.string() }).catch(EMPTY_TEXT);
const storedRoles = z.array(storedText).catch([]);
const storedSocialLinks = z
  .array(z.object({ platform: z.enum(SOCIAL_PLATFORMS), url: z.string() }))
  .catch([]);

/** The settings row as admin form values. Unexpected jsonb shapes fall back to empty. */
export async function getSiteSettingsForAdmin(): Promise<SiteSettingsFormValues> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("site_settings").select("*").maybeSingle();
  if (error) throw error;

  return {
    name: data?.name ?? "",
    headline: storedText.parse(data?.headline),
    roles: storedRoles.parse(data?.roles).map((text) => ({ text })),
    shortIntro: storedText.parse(data?.short_intro),
    fullIntro: storedText.parse(data?.full_intro),
    githubUsername: data?.github_username ?? "",
    socialLinks: storedSocialLinks.parse(data?.social_links),
    seoTitle: storedText.parse(data?.seo_title),
    seoDescription: storedText.parse(data?.seo_description),
  };
}
