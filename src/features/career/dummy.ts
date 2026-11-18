import type { Experience } from "./types";

/**
 * DUMMY DATA (M2): replaced through admin in M4 and read from Supabase in M5.
 * The full-time entry is a Draft on purpose: it mirrors the owner's earlier job,
 * which stays hidden until published (Case 01 §5.2).
 */
export const dummyExperiences: Experience[] = [
  {
    id: "intern-mobile",
    company: "Nusantara Digital Studio",
    logoPath: null,
    position: { en: "Mobile Developer Intern", id: "Mobile Developer Intern" },
    type: "internship",
    startDate: "2026-07-01",
    endDate: null,
    description: {
      en: "Built and shipped Flutter features for a retail app used by thousands of customers.\nRefactored state management to GetX, cutting screen load times noticeably.\nWorked with designers and backend engineers in two-week sprints.",
      id: "Membangun dan merilis fitur Flutter untuk aplikasi retail yang dipakai ribuan pelanggan.\nMerapikan state management ke GetX sehingga waktu muat layar jauh lebih cepat.\nBekerja bersama desainer dan backend engineer dalam sprint dua mingguan.",
    },
    skillIds: ["flutter", "dart", "getx", "firebase"],
    sortOrder: null,
    status: "published",
    deletedAt: null,
  },
  {
    id: "intern-web",
    company: "Kode Kreatif",
    logoPath: null,
    position: { en: "Web Developer Intern", id: "Web Developer Intern" },
    type: "internship",
    startDate: "2025-08-01",
    endDate: "2025-12-31",
    description: {
      en: "Developed an internal inventory dashboard with Laravel and Vue.\nWrote REST endpoints and database migrations for stock and sales data.",
      id: "Mengembangkan dashboard inventaris internal dengan Laravel dan Vue.\nMenulis endpoint REST dan migrasi database untuk data stok dan penjualan.",
    },
    skillIds: ["laravel", "vuedotjs", "mysql"],
    sortOrder: null,
    status: "published",
    deletedAt: null,
  },
  {
    id: "earlier-job",
    company: "Earlier Company",
    logoPath: null,
    position: { en: "Staff", id: "Staf" },
    type: "full_time",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    description: {
      en: "Hidden until published from admin.",
      id: "Tersembunyi sampai dipublikasikan dari admin.",
    },
    skillIds: [],
    sortOrder: null,
    status: "draft",
    deletedAt: null,
  },
];
