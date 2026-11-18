import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

/** Uploaded images are served from the Supabase Storage public URL (Case 02 §9). */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const storagePattern = supabaseUrl ? [new URL(`${supabaseUrl}/storage/v1/object/public/**`)] : [];
const isLocalSupabase = Boolean(
  supabaseUrl && /\/\/(127\.0\.0\.1|localhost)[:/]/.test(supabaseUrl),
);

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Keeps the dev badge clear of the Sign out button in the admin sidebar.
  devIndicators: { position: "bottom-right" },
  images: {
    remotePatterns: storagePattern,
    // Local Supabase runs on 127.0.0.1; production storage is never a local address.
    dangerouslyAllowLocalIP: isLocalSupabase,
  },
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
