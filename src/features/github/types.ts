/** One day in the contribution calendar. */
export type ContributionDay = {
  /** ISO date (yyyy-mm-dd). */
  date: string;
  count: number;
};

export type PinnedRepository = {
  name: string;
  description: string | null;
  url: string;
  language: { name: string; color: string } | null;
  stars: number;
  forks: number;
};

export type LanguageShare = {
  name: string;
  color: string;
  /** Share of code across public repositories, 0–100. */
  percent: number;
};

/**
 * The single `github_snapshot` row (Case 02 §10.1): the last good GitHub data,
 * refreshed by the daily job. The Dashboard only ever reads this snapshot.
 */
export type GithubSnapshot = {
  username: string;
  /** ISO timestamp of the last successful fetch. */
  fetchedAt: string;
  totalContributions: number;
  /** Public profile counts (CR-07). */
  profile: { followers: number; following: number; publicRepos: number };
  /** Oldest first; always whole weeks, starting on a Sunday. */
  contributions: ContributionDay[];
  pinnedRepositories: PinnedRepository[];
  languages: LanguageShare[];
};
