import type { ContentRow } from "./types";

/** Visitors only ever see published content that is not in the trash (Case 01 §6). */
export function isPubliclyVisible(row: Pick<ContentRow, "status" | "deletedAt">): boolean {
  return row.status === "published" && row.deletedAt === null;
}

/**
 * Sort order from Case 01 §10: items with a manual position come first (ascending),
 * the rest follow by date, newest first.
 */
export function compareByManualOrderThenDate<T extends Pick<ContentRow, "sortOrder">>(
  getDate: (item: T) => string | null,
) {
  return (a: T, b: T): number => {
    if (a.sortOrder !== null && b.sortOrder !== null) return a.sortOrder - b.sortOrder;
    if (a.sortOrder !== null) return -1;
    if (b.sortOrder !== null) return 1;
    return (getDate(b) ?? "").localeCompare(getDate(a) ?? "");
  };
}
