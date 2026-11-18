import { z } from "zod";

import { dateSchema, endNotBeforeStart, optionalDateSchema } from "@/lib/content/date-schema";
import { localizedTextSchema } from "@/lib/content/localized-schema";

/** Education entry form (Case 03 M4 #6). */
export const educationFormSchema = z
  .object({
    id: z.uuid().optional(),
    institution: z.string().trim().min(1, "Institution is required.").max(120),
    logoPath: z.string().max(300).nullable(),
    degree: localizedTextSchema({ max: 120, required: true }),
    startDate: dateSchema,
    endDate: optionalDateSchema,
    notes: localizedTextSchema({ max: 2000 }),
    status: z.enum(["draft", "published"]),
  })
  .refine(endNotBeforeStart, { message: "End date is before the start date.", path: ["endDate"] });

export type EducationFormValues = z.infer<typeof educationFormSchema>;
