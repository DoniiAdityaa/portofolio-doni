import type { Education } from "./types";

/** DUMMY DATA (M2): replaced through admin in M4 and read from Supabase in M5. */
export const dummyEducations: Education[] = [
  {
    id: "university",
    institution: "Universitas Teknologi Nusantara",
    logoPath: null,
    degree: { en: "Bachelor of Informatics", id: "S1 Informatika" },
    startDate: "2022-09-01",
    endDate: "2026-08-31",
    notes: {
      en: "Focus on mobile and software engineering. Member of the campus developer community.",
      id: "Fokus pada mobile dan rekayasa perangkat lunak. Anggota komunitas developer kampus.",
    },
    sortOrder: null,
    status: "published",
    deletedAt: null,
  },
  {
    id: "high-school",
    institution: "SMK Negeri 1 Nusantara",
    logoPath: null,
    degree: { en: "Software Engineering (Vocational)", id: "Rekayasa Perangkat Lunak" },
    startDate: "2019-07-01",
    endDate: "2022-06-30",
    notes: { en: "", id: "" },
    sortOrder: null,
    status: "published",
    deletedAt: null,
  },
];
