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
    responsibilities: {
      en: "Built and shipped Flutter features for a retail app used by thousands of customers.\nIntegrated REST APIs and Firebase push notifications.\nWorked with designers and backend engineers in two-week sprints.",
      id: "Membangun dan merilis fitur Flutter untuk aplikasi retail yang dipakai ribuan pelanggan.\nMengintegrasikan REST API dan push notification Firebase.\nBekerja bersama desainer dan backend engineer dalam sprint dua mingguan.",
    },
    learnings: {
      en: "Structuring a large Flutter codebase with clean architecture and GetX.\nWriting widget tests and reviewing pull requests in a team.",
      id: "Menyusun codebase Flutter besar dengan clean architecture dan GetX.\nMenulis widget test dan me-review pull request dalam tim.",
    },
    impact: {
      en: "Cut the product list load time noticeably by refactoring state management and caching.\nShipped the checkout redesign that raised completed orders.",
      id: "Mempercepat waktu muat daftar produk secara signifikan lewat refactor state management dan caching.\nMerilis desain ulang checkout yang menaikkan jumlah pesanan selesai.",
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
    responsibilities: {
      en: "Developed an internal inventory dashboard with Laravel and Vue.\nWrote REST endpoints and database migrations for stock and sales data.",
      id: "Mengembangkan dashboard inventaris internal dengan Laravel dan Vue.\nMenulis endpoint REST dan migrasi database untuk data stok dan penjualan.",
    },
    learnings: {
      en: "Designing relational schemas and writing efficient queries.\nWorking with Git flow and code reviews in a professional team.",
      id: "Merancang skema relasional dan menulis query yang efisien.\nBekerja dengan Git flow dan code review dalam tim profesional.",
    },
    impact: {
      en: "Replaced manual spreadsheets, saving the warehouse team hours every week.",
      id: "Menggantikan spreadsheet manual sehingga tim gudang menghemat berjam-jam setiap minggu.",
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
    responsibilities: {
      en: "Hidden until published from admin.",
      id: "Tersembunyi sampai dipublikasikan dari admin.",
    },
    learnings: { en: "", id: "" },
    impact: { en: "", id: "" },
    skillIds: [],
    sortOrder: null,
    status: "draft",
    deletedAt: null,
  },
];
