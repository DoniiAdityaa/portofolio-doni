import { z } from "zod";

import { dateSchema, endNotBeforeStart, optionalDateSchema } from "@/lib/content/date-schema";
import { localizedTextSchema } from "@/lib/content/localized-schema";

export const EXPERIENCE_TYPES = ["full_time", "internship", "freelance", "contract"] as const;

export const EXPERIENCE_TYPE_LABELS: Record<(typeof EXPERIENCE_TYPES)[number], string> = {
  full_time: "Full-time",
  internship: "Internship",
  freelance: "Freelance",
  contract: "Contract",
};

/** Career entry form (Case 03 M4 #6). Lists are one item per line (CR-04). */
export const experienceFormSchema = z
  .object({
    id: z.uuid().optional(),
    company: z.string().trim().min(1, "Company is required.").max(100),
    logoPath: z.string().max(300).nullable(),
    position: localizedTextSchema({ max: 100, required: true }),
    type: z.enum(EXPERIENCE_TYPES),
    startDate: dateSchema,
    endDate: optionalDateSchema,
    responsibilities: localizedTextSchema({ max: 3000 }),
    learnings: localizedTextSchema({ max: 3000 }),
    impact: localizedTextSchema({ max: 3000 }),
    skillIds: z.array(z.uuid()).max(30),
    status: z.enum(["draft", "published"]),
  })
  .refine(endNotBeforeStart, { message: "End date is before the start date.", path: ["endDate"] });

export type ExperienceFormValues = z.infer<typeof experienceFormSchema>;
