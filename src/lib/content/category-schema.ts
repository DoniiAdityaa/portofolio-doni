import { z } from "zod";

import { localizedTextSchema } from "./localized-schema";

/** Form for any category-like row: skill and achievement categories, project types. */
export const categoryFormSchema = z.object({
  id: z.uuid().optional(),
  name: localizedTextSchema({ max: 40, required: true }),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export type AdminCategory = Required<CategoryFormValues>;
