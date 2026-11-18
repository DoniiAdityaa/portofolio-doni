import { compareByManualOrderThenDate, isPubliclyVisible } from "@/lib/content/visibility";

import { dummyEducations } from "./dummy";
import type { Education } from "./types";

/** Published education entries, newest first unless reordered in admin (Case 01 §5.2). */
export async function getPublishedEducations(): Promise<Education[]> {
  return dummyEducations
    .filter(isPubliclyVisible)
    .sort(compareByManualOrderThenDate<Education>((item) => item.startDate));
}
