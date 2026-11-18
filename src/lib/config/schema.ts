import { z } from "zod";

/**
 * Environment schemas, shared by the server and client loaders and by tests.
 *
 * Variables a milestone has not reached yet are optional, so the app runs from M0 on.
 * When a milestone starts using a variable, make it required here (see .env.example).
 */

/** Treats an empty string from .env as "not set". */
const optionalString = z
  .string()
  .optional()
  .transform((value) => (value === "" ? undefined : value));

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: optionalString.pipe(z.url().optional()),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: optionalString,
});

export const serverEnvSchema = clientEnvSchema.extend({
  SUPABASE_SECRET_KEY: optionalString,
  GITHUB_TOKEN: optionalString,
  CRON_SECRET: optionalString,
  VISITOR_HASH_SALT: optionalString,
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/** Parses raw values and throws one readable error listing every invalid variable. */
export function parseEnv<TSchema extends z.ZodType>(
  schema: TSchema,
  raw: Record<string, string | undefined>,
): z.infer<TSchema> {
  const result = schema.safeParse(raw);

  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${problems}`);
  }

  return result.data;
}
