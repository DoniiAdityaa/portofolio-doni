import type { Project, ProjectCategory } from "./types";

/** DUMMY DATA (M2): replaced through admin in M4 and read from Supabase in M5. */
export const dummyProjectCategories: ProjectCategory[] = [
  { id: "mobile", name: { en: "Mobile", id: "Mobile" }, sortOrder: 1 },
  { id: "web", name: { en: "Web", id: "Web" }, sortOrder: 2 },
  { id: "backend", name: { en: "Backend", id: "Backend" }, sortOrder: 3 },
];

const noLinks = { repoUrl: null, demoUrl: null, playStoreUrl: null, appStoreUrl: null };

export const dummyProjects: Project[] = [
  {
    id: "pokeatlas",
    slug: "pokeatlas",
    title: { en: "PokeAtlas", id: "PokeAtlas" },
    summary: {
      en: "A Pokémon encyclopedia with fast search, rich detail pages, and offline favorites.",
      id: "Ensiklopedia Pokémon dengan pencarian cepat, halaman detail lengkap, dan favorit offline.",
    },
    thumbnailPath: null,
    categoryId: "mobile",
    projectStatus: "in_progress",
    startedAt: "2026-09-01",
    endedAt: null,
    isFeatured: true,
    ...noLinks,
    skillIds: ["flutter", "dart", "getx"],
    sortOrder: 1,
    status: "published",
    deletedAt: null,
  },
  {
    id: "laundry-hub",
    slug: "laundry-hub",
    title: { en: "Laundry Hub", id: "Laundry Hub" },
    summary: {
      en: "Order tracking app for a local laundry, with real-time status and push notifications.",
      id: "Aplikasi pelacakan pesanan untuk laundry lokal, dengan status real-time dan notifikasi.",
    },
    thumbnailPath: null,
    categoryId: "mobile",
    projectStatus: "completed",
    startedAt: "2025-11-01",
    endedAt: "2026-03-01",
    isFeatured: true,
    ...noLinks,
    skillIds: ["flutter", "firebase", "dart"],
    sortOrder: null,
    status: "published",
    deletedAt: null,
  },
  {
    id: "stockwise",
    slug: "stockwise",
    title: { en: "StockWise", id: "StockWise" },
    summary: {
      en: "Inventory dashboard with stock alerts, sales charts, and role-based access.",
      id: "Dashboard inventaris dengan peringatan stok, grafik penjualan, dan akses berbasis peran.",
    },
    thumbnailPath: null,
    categoryId: "web",
    projectStatus: "completed",
    startedAt: "2025-03-01",
    endedAt: "2025-08-01",
    isFeatured: true,
    ...noLinks,
    skillIds: ["laravel", "vuedotjs", "mysql"],
    sortOrder: null,
    status: "published",
    deletedAt: null,
  },
  {
    id: "portfolio",
    slug: "portfolio",
    title: { en: "Portfolio Website", id: "Website Portofolio" },
    summary: {
      en: "This site: a bilingual portfolio with an admin CMS.",
      id: "Situs ini: portofolio dua bahasa dengan CMS admin.",
    },
    thumbnailPath: null,
    categoryId: "web",
    projectStatus: "in_progress",
    startedAt: "2026-11-01",
    endedAt: null,
    isFeatured: false,
    ...noLinks,
    repoUrl: "https://github.com/DoniiAdityaa/portofolio-doni",
    skillIds: ["nextdotjs", "typescript", "tailwindcss", "supabase"],
    sortOrder: null,
    status: "published",
    deletedAt: null,
  },
];
