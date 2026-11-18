import "server-only";

import type { GithubUserResponse } from "./github-mapper";
import { mapGithubResponse } from "./github-mapper";
import type { GithubSnapshot } from "./types";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

const SNAPSHOT_QUERY = /* GraphQL */ `
  query Snapshot($login: String!) {
    user(login: $login) {
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
        totalCount
        nodes {
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

type GraphqlResponse = {
  data?: { user: GithubUserResponse | null };
  errors?: { message: string }[];
};

/**
 * Fetches profile counts, pinned repositories, languages, and the contribution calendar
 * in one GraphQL call (Case 02 §10.1). Throws on any failure so callers can fall back.
 */
export async function fetchGithubSnapshot(
  username: string,
  token: string,
): Promise<GithubSnapshot> {
  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "portfolio-dashboard",
    },
    body: JSON.stringify({ query: SNAPSHOT_QUERY, variables: { login: username } }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API responded with ${response.status}`);
  }

  const json = (await response.json()) as GraphqlResponse;
  if (json.errors?.length) {
    throw new Error(`GitHub API error: ${json.errors.map((error) => error.message).join("; ")}`);
  }
  if (!json.data?.user) {
    throw new Error(`GitHub user "${username}" was not found`);
  }

  return mapGithubResponse(username, json.data.user, new Date().toISOString());
}
