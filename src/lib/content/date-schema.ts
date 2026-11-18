import { z } from "zod";

/** A required date from an `<input type="date">` (yyyy-mm-dd). */
export const dateSchema = z.iso.date("Pick a date.");

/** An optional end date: empty means "Present" / ongoing. */
export const optionalDateSchema = z.union([z.iso.date(), z.literal("")]);

/** The end date must not be before the start date. */
export function endNotBeforeStart<T extends { startDate: string; endDate: string }>(value: T) {
  return value.endDate === "" || value.endDate >= value.startDate;
}
