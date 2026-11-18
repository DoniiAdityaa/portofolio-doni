import { dummyCaseStudies } from "./dummy-case-studies";
import type { Project, ProjectCategory, ProjectType } from "./types";

/** DUMMY DATA (M2): replaced through admin in M4 and read from Supabase in M5. */
export const dummyProjectTypes: ProjectType[] = [
  { id: "web", name: { en: "Web", id: "Web" }, sortOrder: 1 },
  { id: "mobile", name: { en: "Mobile", id: "Mobile" }, sortOrder: 2 },
];

export const dummyProjectCategories: ProjectCategory[] = [
  { id: "personal", name: { en: "Personal project", id: "Proyek Pribadi" }, sortOrder: 1 },
  { id: "internship", name: { en: "Internship", id: "Magang" }, sortOrder: 2 },
  { id: "freelance", name: { en: "Freelance", id: "Freelance" }, sortOrder: 3 },
  { id: "competition", name: { en: "Competition", id: "Lomba" }, sortOrder: 4 },
];

const noLinks = { repoUrl: null, demoUrl: null, playStoreUrl: null, appStoreUrl: null };

type ProjectBase = Omit<
  Project,
  "overview" | "problem" | "solution" | "features" | "challenges" | "images"
>;

const baseProjects: ProjectBase[] = [
  {
    id: "pokeatlas",
    slug: "pokeatlas",
    title: { en: "PokeAtlas", id: "PokeAtlas" },
    summary: {
      en: "A Pokémon encyclopedia with fast search, rich detail pages, and offline favorites.",
      id: "Ensiklopedia Pokémon dengan pencarian cepat, halaman detail lengkap, dan favorit offline.",
    },
    thumbnailPath: null,
    typeId: "mobile",
    categoryId: "personal",
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
    typeId: "mobile",
    categoryId: "freelance",
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
    typeId: "web",
    categoryId: "internship",
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
    id: "foodshare",
    slug: "foodshare",
    title: { en: "FoodShare", id: "FoodShare" },
    summary: {
      en: "Hackathon-winning app that connects local food banks with nearby donors.",
      id: "Aplikasi juara hackathon yang menghubungkan bank makanan lokal dengan donatur terdekat.",
    },
    thumbnailPath: null,
    typeId: "mobile",
    categoryId: "competition",
    projectStatus: "completed",
    startedAt: "2025-11-18",
    endedAt: "2025-11-20",
    isFeatured: false,
    ...noLinks,
    skillIds: ["flutter", "firebase"],
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
    typeId: "web",
    categoryId: "personal",
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

const noCaseStudy = {
  overview: { en: "", id: "" },
  problem: { en: "", id: "" },
  solution: { en: "", id: "" },
  features: { en: "", id: "" },
  challenges: { en: "", id: "" },
  images: [],
};

export const dummyProjects: Project[] = baseProjects.map((project) => ({
  ...project,
  ...(dummyCaseStudies[project.id] ?? noCaseStudy),
}));
