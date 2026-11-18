import type { MetadataRoute } from "next";

import { getPublishedProjectSlugs } from "@/features/projects/queries";
import { clientEnv } from "@/lib/config/client";
import { routing } from "@/lib/i18n/routing";

const PAGES = ["", "/about", "/achievements", "/projects", "/dashboard", "/contact"];

/** Every public page in both languages, linked as alternates (Case 01 §2). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPublishedProjectSlugs();
  const paths = [...PAGES, ...slugs.map((slug) => `/projects/${slug}`)];
  const url = (locale: string, path: string) =>
    `${clientEnv.NEXT_PUBLIC_SITE_URL}/${locale}${path}`;

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: url(locale, path),
      alternates: {
        languages: Object.fromEntries(routing.locales.map((other) => [other, url(other, path)])),
      },
    })),
  );
}
