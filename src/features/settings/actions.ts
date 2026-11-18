"use server";

import { updateTag } from "next/cache";

import { runAdminAction } from "@/lib/actions/admin-action";
import { type ActionResult, ok } from "@/lib/actions/result";
import { removeMediaFiles } from "@/lib/actions/storage";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { siteSettingsFormSchema } from "./schema";

/** Saves the single site_settings row. */
export async function updateSiteSettings(input: unknown): Promise<ActionResult> {
  return runAdminAction(siteSettingsFormSchema, input, async (values) => {
    const supabase = await createSupabaseServerClient();
    const { data: current, error: readError } = await supabase
      .from("site_settings")
      .select("photo_path")
      .maybeSingle();
    if (readError) throw readError;

    const { error } = await supabase.from("site_settings").upsert({
      id: 1,
      name: values.name,
      photo_path: values.photoPath,
      headline: values.headline,
      roles: values.roles.map((role) => role.text),
      short_intro: values.shortIntro,
      full_intro: values.fullIntro,
      github_username: values.githubUsername || null,
      social_links: values.socialLinks,
      seo_title: values.seoTitle,
      seo_description: values.seoDescription,
    });
    if (error) throw error;
    if (current?.photo_path && current.photo_path !== values.photoPath) {
      await removeMediaFiles([current.photo_path]);
    }

    updateTag(CACHE_TAGS.settings);
    return ok();
  });
}
