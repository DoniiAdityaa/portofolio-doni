import type { SiteSettings } from "./types";

/** DUMMY DATA (M2). Replaced by the Supabase `site_settings` row in M5. */
export const dummySiteSettings: SiteSettings = {
  name: "Doni",
  headline: { en: "Mobile Developer (Flutter)", id: "Mobile Developer (Flutter)" },
  shortIntro: {
    en: "I build Flutter apps that feel smooth, look clean, and solve real problems. I care about tidy architecture, readable code, and the small details that make an app a pleasure to use.",
    id: "Saya membangun aplikasi Flutter yang mulus, rapi, dan menyelesaikan masalah nyata. Saya peduli pada arsitektur yang tertata, kode yang mudah dibaca, dan detail kecil yang membuat aplikasi nyaman dipakai.",
  },
  socialLinks: [{ platform: "github", url: "https://github.com/DoniiAdityaa" }],
  githubUsername: "DoniiAdityaa",
};
