import type { MetadataRoute } from "next";

import { clientEnv } from "@/lib/config/client";

/** Search engines may crawl the public site, never the admin area or the API. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${clientEnv.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
