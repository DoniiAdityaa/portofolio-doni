import { z } from "zod";

/** Skill form (Case 03 M4 #5). `id` is empty for a new skill. */
export const skillFormSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1, "Name is required.").max(60),
  iconSlug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+$/, "Use the Simple Icons slug, e.g. flutter or nextdotjs."),
  categoryId: z.uuid("Pick a category."),
  status: z.enum(["draft", "published"]),
});

export type SkillFormValues = z.infer<typeof skillFormSchema>;

export {
  type CategoryFormValues as SkillCategoryFormValues,
  categoryFormSchema as skillCategoryFormSchema,
} from "@/lib/content/category-schema";
