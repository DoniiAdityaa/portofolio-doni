import { z } from "zod";

import { dateSchema, endNotBeforeStart, optionalDateSchema } from "@/lib/content/date-schema";
import { localizedTextSchema } from "@/lib/content/localized-schema";

export const PROJECT_STATUSES = ["completed", "in_progress", "archived"] as const;

export const PROJECT_STATUS_LABELS: Record<(typeof PROJECT_STATUSES)[number], string> = {
  completed: "Completed",
  in_progress: "In progress",
  archived: "Archived (finished or paused)",
};

export const MAX_GALLERY_IMAGES = 20;

const optionalUrl = z.union([z.url("Use a full URL (https://…)."), z.literal("")]);
const caseStudySection = localizedTextSchema({ max: 10000 });

export const projectImageSchema = z.object({
  path: z.string().min(1).max(300),
  alt: localizedTextSchema({ max: 150 }),
  orientation: z.enum(["portrait", "landscape"]),
});

/** Project form (Case 03 M4 #8). Slug is generated from the English title when empty. */
export const projectFormSchema = z
  .object({
    id: z.uuid().optional(),
    slug: z.union([
      z
        .string()
        .trim()
        .max(80)
        .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and dashes."),
      z.literal(""),
    ]),
    title: localizedTextSchema({ max: 100, required: true }),
    summary: localizedTextSchema({ max: 300, required: true }),
    thumbnailPath: z.string().max(300).nullable(),
    typeId: z.uuid("Pick a type."),
    categoryId: z.uuid("Pick a category."),
    projectStatus: z.enum(PROJECT_STATUSES),
    startDate: dateSchema,
    endDate: optionalDateSchema,
    isFeatured: z.boolean(),
    repoUrl: optionalUrl,
    demoUrl: optionalUrl,
    playStoreUrl: optionalUrl,
    appStoreUrl: optionalUrl,
    overview: caseStudySection,
    problem: caseStudySection,
    solution: caseStudySection,
    features: caseStudySection,
    challenges: caseStudySection,
    skillIds: z.array(z.uuid()).max(30),
    images: z.array(projectImageSchema).max(MAX_GALLERY_IMAGES),
    status: z.enum(["draft", "published"]),
  })
  .refine(endNotBeforeStart, { message: "End date is before the start date.", path: ["endDate"] });

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type ProjectImageValues = z.infer<typeof projectImageSchema>;

/** "My Cool App!" → "my-cool-app". */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}
