import { clientEnvSchema, parseEnv } from "./schema";

/**
 * Public environment variables, safe to use in any component.
 *
 * Each variable is read by its full name: Next.js only inlines `process.env.NEXT_PUBLIC_*`
 * references written out literally, never dynamic lookups.
 */
export const clientEnv = parseEnv(clientEnvSchema, {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});
