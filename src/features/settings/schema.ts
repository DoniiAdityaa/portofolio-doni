import { z } from "zod";

import { localizedTextSchema } from "@/lib/content/localized-schema";

import type { SocialPlatform } from "./types";

export const SOCIAL_PLATFORMS = [
  "github",
  "linkedin",
  "instagram",
  "x",
  "tiktok",
  "email",
] as const satisfies readonly SocialPlatform[];

export const MAX_ROLES = 6;
export const MAX_SOCIAL_LINKS = 8;

const socialLinkSchema = z
  .object({
    platform: z.enum(SOCIAL_PLATFORMS),
    url: z.string().trim().min(1, "Add a link or address."),
  })
  .refine(
    ({ platform, url }) =>
      platform === "email" ? z.email().safeParse(url).success : z.url().safeParse(url).success,
    { message: "Use a full URL (https://…), or an email address for Email.", path: ["url"] },
  );

/** Site Settings form (Case 03 M4 #4), validated in the browser and again on the server. */
export const siteSettingsFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(80),
  photoPath: z.string().max(300).nullable(),
  headline: localizedTextSchema({ max: 120, required: true }),
  roles: z
    .array(z.object({ text: localizedTextSchema({ max: 40, required: true }) }))
    .max(MAX_ROLES, `Up to ${MAX_ROLES} roles.`),
  shortIntro: localizedTextSchema({ max: 400, required: true }),
  fullIntro: localizedTextSchema({ max: 4000 }),
  githubUsername: z
    .string()
    .trim()
    .max(39)
    .regex(/^[a-z\d](?:[a-z\d-]*[a-z\d])?$|^$/i, "Use a valid GitHub username."),
  socialLinks: z.array(socialLinkSchema).max(MAX_SOCIAL_LINKS),
  seoTitle: localizedTextSchema({ max: 70 }),
  seoDescription: localizedTextSchema({ max: 160 }),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsFormSchema>;
