import "server-only";

import type { SimpleIcon } from "simple-icons";
import * as simpleIcons from "simple-icons";

import { findBrandIcon, readableBrandColor } from "@/components/ui/brand-icon";

/** Just enough of a Simple Icons entry to draw it, so the full icon set stays on the server. */
export type IconPreview = {
  slug: string;
  title: string;
  path: string;
  /** Brand color, or `null` when it is unreadable on the dark background. */
  color: string | null;
};

const MAX_SUGGESTIONS = 8;

const ALL_ICONS = Object.values(simpleIcons).filter(
  (value): value is SimpleIcon => typeof value === "object" && value !== null && "slug" in value,
);

function toPreview(icon: SimpleIcon): IconPreview {
  return {
    slug: icon.slug,
    title: icon.title,
    path: icon.path,
    color: readableBrandColor(icon.hex) ?? null,
  };
}

export function getIconPreview(slug: string): IconPreview | null {
  const icon = findBrandIcon(slug);
  return icon ? toPreview(icon) : null;
}

/** Icons whose name or slug matches, best matches first (e.g. "html" → HTML5). */
export function searchIcons(query: string): IconPreview[] {
  const needle = query
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  if (!needle) return [];

  const rank = (icon: SimpleIcon) => {
    const title = icon.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (icon.slug === needle || title === needle) return 0;
    if (icon.slug.startsWith(needle) || title.startsWith(needle)) return 1;
    return 2;
  };

  return ALL_ICONS.filter(
    (icon) =>
      icon.slug.includes(needle) ||
      icon.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .includes(needle),
  )
    .sort((a, b) => rank(a) - rank(b) || a.title.length - b.title.length)
    .slice(0, MAX_SUGGESTIONS)
    .map(toPreview);
}
