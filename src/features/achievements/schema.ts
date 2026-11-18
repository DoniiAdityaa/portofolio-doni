import { z } from "zod";

import { dateSchema, optionalDateSchema } from "@/lib/content/date-schema";
import { localizedTextSchema } from "@/lib/content/localized-schema";

export const ACHIEVEMENT_TYPES = ["certificate", "award"] as const;

export const ACHIEVEMENT_TYPE_LABELS: Record<(typeof ACHIEVEMENT_TYPES)[number], string> = {
  certificate: "Certificate",
  award: "Award",
};

/** Empty means "no category". */
const NO_CATEGORY = "";

/** Achievement form (Case 03 M4 #7). */
export const achievementFormSchema = z
  .object({
    id: z.uuid().optional(),
    title: localizedTextSchema({ max: 150, required: true }),
    type: z.enum(ACHIEVEMENT_TYPES),
    imagePath: z.string().max(300).nullable(),
    issuer: z.string().trim().min(1, "Issuer is required.").max(120),
    issuedAt: dateSchema,
    expiresAt: optionalDateSchema,
    credentialUrl: z.union([z.url("Use a full URL (https://…)."), z.literal("")]),
    credentialId: z.string().trim().max(120),
    categoryId: z.union([z.uuid(), z.literal(NO_CATEGORY)]),
    description: localizedTextSchema({ max: 2000 }),
    skillIds: z.array(z.uuid()).max(30),
    status: z.enum(["draft", "published"]),
  })
  .refine((value) => value.expiresAt === "" || value.expiresAt >= value.issuedAt, {
    message: "Expiry is before the issue date.",
    path: ["expiresAt"],
  });

export type AchievementFormValues = z.infer<typeof achievementFormSchema>;
