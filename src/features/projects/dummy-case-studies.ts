import type { Project } from "./types";

type CaseStudy = Pick<
  Project,
  "overview" | "problem" | "solution" | "features" | "challenges" | "images"
>;

const empty = { en: "", id: "" };

/** DUMMY DATA (M2): case-study content per project id, written in Markdown. */
export const dummyCaseStudies: Record<string, CaseStudy> = {
  pokeatlas: {
    overview: {
      en: "**PokeAtlas** is a fast, offline-friendly Pokédex built with Flutter. It pulls data from the public PokeAPI and turns it into a smooth browsing experience on any phone.",
      id: "**PokeAtlas** adalah Pokédex yang cepat dan ramah offline, dibangun dengan Flutter. Data diambil dari PokeAPI publik lalu disajikan dengan pengalaman menjelajah yang mulus di ponsel apa pun.",
    },
    problem: {
      en: "Most Pokédex apps are slow on low-end phones, need a connection for every screen, and bury useful stats under ads.",
      id: "Kebanyakan aplikasi Pokédex lambat di ponsel kelas bawah, butuh koneksi di setiap layar, dan menyembunyikan statistik penting di balik iklan.",
    },
    solution: {
      en: "A lightweight app with aggressive caching, paginated lists, and a clean detail screen.\n\n- Responses are cached locally, so visited Pokémon load instantly offline.\n- Images are resized and cached to keep scrolling at 60 fps.",
      id: "Aplikasi ringan dengan caching agresif, daftar berhalaman, dan layar detail yang bersih.\n\n- Respons disimpan lokal, sehingga Pokémon yang pernah dibuka langsung tampil saat offline.\n- Gambar diperkecil dan di-cache agar scroll tetap 60 fps.",
    },
    features: {
      en: "- Instant search by name or number\n- Type, ability, and evolution details\n- Offline favorites\n- Light haptics and smooth hero animations",
      id: "- Pencarian instan berdasarkan nama atau nomor\n- Detail tipe, ability, dan evolusi\n- Favorit offline\n- Haptic ringan dan animasi hero yang mulus",
    },
    challenges: {
      en: "Keeping memory low while showing hundreds of images was the hardest part. I learned to profile with **Flutter DevTools**, lazy-load aggressively, and structure state with GetX controllers per screen.",
      id: "Bagian tersulit adalah menjaga memori tetap rendah saat menampilkan ratusan gambar. Saya belajar profiling dengan **Flutter DevTools**, lazy-load secara agresif, dan menyusun state dengan controller GetX per layar.",
    },
    images: [
      {
        id: "p1",
        path: null,
        alt: { en: "Pokédex list", id: "Daftar Pokédex" },
        orientation: "portrait",
        sortOrder: 1,
      },
      {
        id: "p2",
        path: null,
        alt: { en: "Pokémon detail", id: "Detail Pokémon" },
        orientation: "portrait",
        sortOrder: 2,
      },
      {
        id: "p3",
        path: null,
        alt: { en: "Search", id: "Pencarian" },
        orientation: "portrait",
        sortOrder: 3,
      },
      {
        id: "p4",
        path: null,
        alt: { en: "Favorites", id: "Favorit" },
        orientation: "portrait",
        sortOrder: 4,
      },
    ],
  },
  "laundry-hub": {
    overview: {
      en: "A customer app for a local laundry: place orders, track progress in real time, and get notified when clothes are ready.",
      id: "Aplikasi pelanggan untuk laundry lokal: buat pesanan, lacak progres secara real-time, dan dapat notifikasi saat cucian siap.",
    },
    problem: {
      en: "Customers kept calling the shop to ask whether their laundry was done.",
      id: "Pelanggan terus menelepon toko untuk menanyakan apakah cucian sudah selesai.",
    },
    solution: {
      en: "Firestore streams order status to the app, and Cloud Messaging sends a push notification at each step.",
      id: "Firestore mengalirkan status pesanan ke aplikasi, dan Cloud Messaging mengirim notifikasi di setiap tahap.",
    },
    features: {
      en: "- Order history\n- Live status timeline\n- Push notifications",
      id: "- Riwayat pesanan\n- Timeline status langsung\n- Push notification",
    },
    challenges: empty,
    images: [
      {
        id: "l1",
        path: null,
        alt: { en: "Order status", id: "Status pesanan" },
        orientation: "portrait",
        sortOrder: 1,
      },
      {
        id: "l2",
        path: null,
        alt: { en: "Order history", id: "Riwayat pesanan" },
        orientation: "portrait",
        sortOrder: 2,
      },
    ],
  },
  stockwise: {
    overview: {
      en: "An inventory dashboard for a small warehouse, replacing spreadsheets with real-time stock and sales data.",
      id: "Dashboard inventaris untuk gudang kecil, menggantikan spreadsheet dengan data stok dan penjualan real-time.",
    },
    problem: empty,
    solution: empty,
    features: {
      en: "- Low-stock alerts\n- Sales charts\n- Role-based access",
      id: "- Peringatan stok menipis\n- Grafik penjualan\n- Akses berbasis peran",
    },
    challenges: empty,
    images: [
      {
        id: "s1",
        path: null,
        alt: { en: "Dashboard", id: "Dashboard" },
        orientation: "landscape",
        sortOrder: 1,
      },
      {
        id: "s2",
        path: null,
        alt: { en: "Stock list", id: "Daftar stok" },
        orientation: "landscape",
        sortOrder: 2,
      },
    ],
  },
  foodshare: {
    overview: {
      en: "Built in 36 hours at a campus hackathon with a team of three, and awarded **1st place**.",
      id: "Dibangun dalam 36 jam di hackathon kampus bersama tim tiga orang, dan meraih **juara 1**.",
    },
    problem: empty,
    solution: empty,
    features: {
      en: "- Map of nearby food banks\n- One-tap donation pickup requests",
      id: "- Peta bank makanan terdekat\n- Permintaan penjemputan donasi sekali ketuk",
    },
    challenges: empty,
    images: [],
  },
  portfolio: {
    overview: {
      en: "This website: a bilingual portfolio with a private admin area, built with Next.js and Supabase.",
      id: "Website ini: portofolio dua bahasa dengan area admin privat, dibangun dengan Next.js dan Supabase.",
    },
    problem: empty,
    solution: empty,
    features: empty,
    challenges: empty,
    images: [],
  },
};
