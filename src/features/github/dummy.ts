import type { ContributionDay, GithubSnapshot } from "./types";

/**
 * DUMMY DATA (M2). M6 replaces this with the real snapshot saved by the daily GitHub job.
 * Values are generated from a fixed seed, so every build renders the same calendar.
 */
const WEEKS = 53;
const FIRST_SUNDAY = Date.UTC(2025, 10, 16); // 16 Nov 2025
const DAY_MS = 24 * 60 * 60 * 1000;

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function buildDummyCalendar(): ContributionDay[] {
  const random = seededRandom(2026);
  return Array.from({ length: WEEKS * 7 }, (_, index) => {
    const date = new Date(FIRST_SUNDAY + index * DAY_MS).toISOString().slice(0, 10);
    const weekday = index % 7;
    const weekendFactor = weekday === 0 || weekday === 6 ? 0.45 : 1;
    const busySeason = index > 230 ? 1.6 : 1; // more activity during the internship
    const roll = random();
    const count = roll < 0.28 ? 0 : Math.round(roll * 9 * weekendFactor * busySeason);
    return { date, count };
  });
}

const contributions = buildDummyCalendar();

export const dummyGithubSnapshot: GithubSnapshot = {
  username: "DoniiAdityaa",
  fetchedAt: "2026-11-18T03:00:00Z",
  totalContributions: contributions.reduce((sum, day) => sum + day.count, 0),
  contributions,
  pinnedRepositories: [
    {
      name: "pokeatlas",
      description: "Pokémon encyclopedia app built with Flutter and GetX.",
      url: "https://github.com/DoniiAdityaa",
      language: { name: "Dart", color: "#00B4AB" },
      stars: 24,
      forks: 5,
    },
    {
      name: "portofolio-doni",
      description: "Bilingual developer portfolio with an admin CMS (Next.js, Supabase).",
      url: "https://github.com/DoniiAdityaa/portofolio-doni",
      language: { name: "TypeScript", color: "#3178C6" },
      stars: 12,
      forks: 2,
    },
    {
      name: "laundry-hub",
      description: "Order tracking app with real-time status and push notifications.",
      url: "https://github.com/DoniiAdityaa",
      language: { name: "Dart", color: "#00B4AB" },
      stars: 9,
      forks: 1,
    },
    {
      name: "stockwise",
      description: "Inventory dashboard with stock alerts and sales charts.",
      url: "https://github.com/DoniiAdityaa",
      language: { name: "PHP", color: "#4F5D95" },
      stars: 6,
      forks: 0,
    },
  ],
  languages: [
    { name: "Dart", color: "#00B4AB", percent: 46.2 },
    { name: "TypeScript", color: "#3178C6", percent: 21.5 },
    { name: "PHP", color: "#4F5D95", percent: 14.8 },
    { name: "Vue", color: "#41B883", percent: 9.1 },
    { name: "Kotlin", color: "#A97BFF", percent: 5.3 },
    { name: "Other", color: "#64748B", percent: 3.1 },
  ],
};
