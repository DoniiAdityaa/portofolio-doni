import { describe, expect, it } from "vitest";

import type { GithubUserResponse } from "./github-mapper";
import { alignToSunday, mapGithubResponse, summarizeLanguages } from "./github-mapper";

const repo = (languages: [string, number][]) => ({
  languages: {
    edges: languages.map(([name, size]) => ({ size, node: { name, color: "#000000" } })),
  },
});

describe("alignToSunday", () => {
  it("pads a calendar that starts mid-week back to Sunday", () => {
    // 2025-11-19 is a Wednesday.
    const days = alignToSunday([{ date: "2025-11-19", count: 3 }]);

    expect(days.map((day) => day.date)).toEqual([
      "2025-11-16",
      "2025-11-17",
      "2025-11-18",
      "2025-11-19",
    ]);
    expect(days[0]?.count).toBe(0);
  });

  it("leaves a calendar that already starts on Sunday unchanged", () => {
    const days = [{ date: "2025-11-16", count: 1 }];
    expect(alignToSunday(days)).toEqual(days);
  });
});

describe("summarizeLanguages", () => {
  it("sums sizes across repositories and groups the rest into Other", () => {
    const languages = summarizeLanguages([
      repo([
        ["Dart", 500],
        ["Kotlin", 100],
      ]),
      repo([
        ["Dart", 300],
        ["TypeScript", 50],
        ["PHP", 20],
        ["Vue", 20],
        ["Shell", 10],
      ]),
    ]);

    expect(languages.map((language) => language.name)).toEqual([
      "Dart",
      "Kotlin",
      "TypeScript",
      "PHP",
      "Vue",
      "Other",
    ]);
    expect(languages[0]?.percent).toBe(80);
    expect(languages.at(-1)?.percent).toBe(1);
  });

  it("returns nothing when there is no code", () => {
    expect(summarizeLanguages([])).toEqual([]);
  });
});

describe("mapGithubResponse", () => {
  it("maps profile counts, pinned repositories, and the calendar", () => {
    const user: GithubUserResponse = {
      followers: { totalCount: 10 },
      following: { totalCount: 4 },
      repositories: { totalCount: 7, nodes: [repo([["Dart", 1]])] },
      pinnedItems: {
        nodes: [
          {
            name: "pokeatlas",
            description: null,
            url: "https://github.com/x/pokeatlas",
            stargazerCount: 3,
            forkCount: 1,
            primaryLanguage: { name: "Dart", color: null },
          },
        ],
      },
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: 2,
          weeks: [{ contributionDays: [{ date: "2025-11-16", contributionCount: 2 }] }],
        },
      },
    };

    const snapshot = mapGithubResponse("x", user, "2026-11-18T00:00:00Z");

    expect(snapshot.profile).toEqual({ followers: 10, following: 4, publicRepos: 7 });
    expect(snapshot.pinnedRepositories[0]?.language?.color).toBe("#64748B");
    expect(snapshot.contributions).toEqual([{ date: "2025-11-16", count: 2 }]);
    expect(snapshot.languages).toEqual([{ name: "Dart", color: "#000000", percent: 100 }]);
  });
});
