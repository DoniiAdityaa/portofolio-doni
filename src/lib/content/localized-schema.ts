import { z } from "zod";

/**
 * A bilingual field `{ en, id }` for admin forms. English is the default language, so it
 * can be required; Indonesian may stay empty and falls back to English (Case 01 §2).
 */
export function localizedTextSchema({
  max,
  required = false,
}: {
  max: number;
  required?: boolean;
}) {
  const english = z.string().trim().max(max, `Keep it under ${max} characters.`);

  return z.object({
    en: required ? english.min(1, "English text is required.") : english,
    id: z.string().trim().max(max, `Keep it under ${max} characters.`),
  });
}
