import type messages from "@/messages/en.json";

import type { routing } from "./routing";

// Makes translation keys and locales type-checked across the app.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
