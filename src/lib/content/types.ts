/**
 * Fields every content table shares (Case 02 §7.1), in the camelCase shape
 * that feature queries return. M5 maps Supabase rows into these types.
 */
export type PublicationStatus = "draft" | "published";

export type ContentRow = {
  id: string;
  status: PublicationStatus;
  /** Manual order set in admin; `null` means "use the default date order". */
  sortOrder: number | null;
  /** Set when moved to the admin trash; `null` means active. */
  deletedAt: string | null;
};
