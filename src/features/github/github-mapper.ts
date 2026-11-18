import type { ContributionDay, GithubSnapshot, LanguageShare, PinnedRepository } from "./types";

/** Languages beyond this many are grouped into "Other". */
const TOP_LANGUAGE_COUNT = 5;
const OTHER_LANGUAGE_COLOR = "#64748B";
const DAY_MS = 24 * 60 * 60 * 1000;

/** The subset of the GitHub GraphQL `user` response this app reads. */
export type GithubUserResponse = {
  followers: { totalCount: number };
  following: { totalCount: number };
  repositories: {
    totalCount: number;
    nodes: {
      languages: { edges: { size: number; node: { name: string; color: string | null } }[] };
    }[];
  };
  pinnedItems: {
    nodes: {
      name: string;
      description: string | null;
      url: string;
      stargazerCount: number;
      forkCount: number;
      primaryLanguage: { name: string; color: string | null } | null;
    }[];
  };
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number;
      weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
    };
  };
};

/** Turns the raw GitHub response into the snapshot shape the Dashboard renders. */
export function mapGithubResponse(
  username: string,
  user: GithubUserResponse,
  fetchedAt: string,
): GithubSnapshot {
  const calendar = user.contributionsCollection.contributionCalendar;

  return {
    username,
    fetchedAt,
    totalContributions: calendar.totalContributions,
    profile: {
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      publicRepos: user.repositories.totalCount,
    },
    contributions: alignToSunday(
      calendar.weeks.flatMap((week) =>
        week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount })),
      ),
    ),
    pinnedRepositories: user.pinnedItems.nodes.map((repo): PinnedRepository => ({
      name: repo.name,
      description: repo.description,
      url: repo.url,
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      language: repo.primaryLanguage
        ? {
            name: repo.primaryLanguage.name,
            color: repo.primaryLanguage.color ?? OTHER_LANGUAGE_COLOR,
          }
        : null,
    })),
    languages: summarizeLanguages(user.repositories.nodes),
  };
}

/**
 * GitHub's first calendar week can start mid-week. Pads it with empty days so the
 * calendar always starts on a Sunday and every column is a full week.
 */
export function alignToSunday(days: ContributionDay[]): ContributionDay[] {
  const first = days[0];
  if (!first) return days;

  const firstDate = new Date(`${first.date}T00:00:00Z`);
  const padding = Array.from({ length: firstDate.getUTCDay() }, (_, index) => {
    const date = new Date(firstDate.getTime() - (firstDate.getUTCDay() - index) * DAY_MS);
    return { date: date.toISOString().slice(0, 10), count: 0 };
  });
  return [...padding, ...days];
}

/** Sums language sizes across repositories, keeps the top five, groups the rest. */
export function summarizeLanguages(
  repositories: GithubUserResponse["repositories"]["nodes"],
): LanguageShare[] {
  const totals = new Map<string, { size: number; color: string }>();
  for (const repo of repositories) {
    for (const { size, node } of repo.languages.edges) {
      const current = totals.get(node.name);
      totals.set(node.name, {
        size: (current?.size ?? 0) + size,
        color: node.color ?? OTHER_LANGUAGE_COLOR,
      });
    }
  }

  const sorted = [...totals.entries()].sort(([, a], [, b]) => b.size - a.size);
  const grandTotal = sorted.reduce((sum, [, value]) => sum + value.size, 0);
  if (grandTotal === 0) return [];

  const toPercent = (size: number) => Math.round((size / grandTotal) * 1000) / 10;
  const top = sorted.slice(0, TOP_LANGUAGE_COUNT).map(([name, value]) => ({
    name,
    color: value.color,
    percent: toPercent(value.size),
  }));
  const otherSize = sorted
    .slice(TOP_LANGUAGE_COUNT)
    .reduce((sum, [, value]) => sum + value.size, 0);

  return otherSize > 0
    ? [...top, { name: "Other", color: OTHER_LANGUAGE_COLOR, percent: toPercent(otherSize) }]
    : top;
}
