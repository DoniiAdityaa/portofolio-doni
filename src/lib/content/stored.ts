import { z } from "zod";

const localizedText = z.object({ en: z.string(), id: z.string() }).catch({ en: "", id: "" });

/** A jsonb `{ en, id }` column as text per language; malformed values become empty text. */
export function storedText(value: unknown): { en: string; id: string } {
  return localizedText.parse(value);
}
