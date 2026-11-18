import { defineRouting } from "next-intl/routing";

/** Bilingual routing (Case 01 §2): every public URL starts with /en or /id. */
export const routing = defineRouting({
  locales: ["en", "id"],
  defaultLocale: "en",
  localePrefix: "always",
  // English is the default for every first visit; the browser language is not used.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
