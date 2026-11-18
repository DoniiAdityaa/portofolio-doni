import { dummySiteSettings } from "./dummy";
import type { SiteSettings } from "./types";

/** Site-wide profile and settings. Reads dummy data until M5 connects Supabase. */
export async function getSiteSettings(): Promise<SiteSettings> {
  return dummySiteSettings;
}

/** "Doni Aditya" → "DA"; used while no profile photo exists. */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
