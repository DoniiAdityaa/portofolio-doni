import type { SiteSettings } from "./types";

/** DUMMY DATA (M2). Replaced by the Supabase `site_settings` row in M5. */
export const dummySiteSettings: SiteSettings = {
  name: "Doni",
  headline: { en: "Mobile Developer (Flutter)", id: "Mobile Developer (Flutter)" },
  roles: [
    { en: "Mobile Developer", id: "Mobile Developer" },
    { en: "Flutter Enthusiast", id: "Flutter Enthusiast" },
    { en: "UI Craftsman", id: "Perajin UI" },
    { en: "Lifelong Learner", id: "Pembelajar Seumur Hidup" },
  ],
  shortIntro: {
    en: "I build Flutter apps that feel smooth, look clean, and solve real problems. I care about tidy architecture, readable code, and the small details that make an app a pleasure to use.",
    id: "Saya membangun aplikasi Flutter yang mulus, rapi, dan menyelesaikan masalah nyata. Saya peduli pada arsitektur yang tertata, kode yang mudah dibaca, dan detail kecil yang membuat aplikasi nyaman dipakai.",
  },
  fullIntro: {
    en: "I'm Doni, a mobile developer who fell in love with building apps the moment I saw my first Flutter widget come to life on a real phone. Since then I've been turning ideas into apps people actually enjoy using.\n\nI focus on clean, maintainable code: clear architecture, predictable state management, and small reusable widgets. I like understanding the problem first, then shipping something simple that works well and grows easily.\n\nOutside of mobile, I explore web development with Laravel and Next.js, because knowing the whole stack helps me design better apps and work better with backend and design teams.",
    id: "Saya Doni, seorang mobile developer yang jatuh cinta pada pembuatan aplikasi sejak pertama kali melihat widget Flutter pertama saya berjalan di ponsel sungguhan. Sejak itu saya terus mengubah ide menjadi aplikasi yang benar-benar nyaman dipakai.\n\nSaya fokus pada kode yang bersih dan mudah dirawat: arsitektur yang jelas, state management yang terprediksi, dan widget kecil yang bisa dipakai ulang. Saya suka memahami masalahnya dulu, lalu merilis solusi sederhana yang berjalan baik dan mudah dikembangkan.\n\nDi luar mobile, saya juga mempelajari web development dengan Laravel dan Next.js, karena memahami seluruh stack membantu saya merancang aplikasi yang lebih baik dan bekerja sama lebih baik dengan tim backend dan desain.",
  },
  // Dummy handles except GitHub; replaced in admin (M4). Empty platforms are simply left out.
  socialLinks: [
    { platform: "email", url: "hello@example.com" },
    { platform: "github", url: "https://github.com/DoniiAdityaa" },
    { platform: "linkedin", url: "https://www.linkedin.com/in/example" },
    { platform: "instagram", url: "https://www.instagram.com/example" },
    { platform: "x", url: "https://x.com/example" },
    { platform: "tiktok", url: "https://www.tiktok.com/@example" },
  ],
  githubUsername: "DoniiAdityaa",
};
