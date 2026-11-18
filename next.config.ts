import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Keeps the dev badge clear of the Sign out button in the admin sidebar.
  devIndicators: { position: "bottom-right" },
  partialPrefetching: true,
  experimental: {
    // One 404 page for URLs outside the [locale] root layout (and, later, the admin root layout).
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
