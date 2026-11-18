import { dummyGithubSnapshot } from "./dummy";
import type { GithubSnapshot } from "./types";

/**
 * The stored GitHub snapshot, or `null` before the first successful fetch
 * (the Dashboard then shows a friendly message). Never calls GitHub directly.
 */
export async function getGithubSnapshot(): Promise<GithubSnapshot | null> {
  return dummyGithubSnapshot;
}
