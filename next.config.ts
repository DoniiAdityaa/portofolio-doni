import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

/** Uploaded images are served from the Supabase Storage public URL (Case 02 §9). */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const storagePattern = supabaseUrl ? [new URL(`${supabaseUrl}/storage/v1/object/public/**`)] : [];
const isLocalSupabase = Boolean(
  supabaseUrl && /\/\/(127\.0\.0\.1|localhost)[:/]/.test(supabaseUrl),
);

const isDev = process.env.NODE_ENV === "development";
const supabaseOrigin = supabaseUrl ? new URL(supabaseUrl).origin : "";

/**
 * Security headers (Case 02 §13). No nonces: pages stay static and cached, so inline
 * scripts (Next.js bootstrap, the theme script) are allowed with 'unsafe-inline'.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data: ${supabaseOrigin}`,
  "font-src 'self'",
  // The admin uploads files to Supabase Storage straight from the browser.
  `connect-src 'self' ${supabaseOrigin}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(supabaseOrigin.startsWith("https:") ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  cacheComponents: true,
  cacheLife: {
    /**
     * Public content (CR-09): admin edits expire it at once through cache tags; otherwise it
     * refreshes daily. A copy is kept for 30 days, so if the database is unreachable the
     * last good content is still served instead of an error.
     */
    content: { stale: 300, revalidate: 86_400, expire: 2_592_000 },
  },
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
