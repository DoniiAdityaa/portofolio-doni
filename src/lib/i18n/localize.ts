import type { Locale } from "./routing";

/** A translatable database field, stored as `{ "en": ..., "id": ... }` (Case 02 §5). */
export type LocalizedText = Partial<Record<Locale, string | null>>;

/**
 * Returns the text for the active locale, falling back to the other language
 * when it is empty (Case 01 §2). Returns an empty string when neither exists.
 */
export function localize(field: LocalizedText | null | undefined, locale: Locale): string {
  if (!field) return "";

  const preferred = field[locale]?.trim();
  if (preferred) return preferred;

  const fallbackLocale: Locale = locale === "en" ? "id" : "en";
  return field[fallbackLocale]?.trim() ?? "";
}
