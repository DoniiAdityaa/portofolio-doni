import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EMPTY_ACHIEVEMENT, getAchievementForEdit } from "@/features/achievements/admin-queries";
import { AchievementForm } from "@/features/achievements/components/achievement-form";
import { getSkillOptions } from "@/features/skills/admin-queries";
import { getCategories } from "@/lib/actions/category-rows";

export const metadata: Metadata = { title: "Edit achievement" };

/** `/admin/achievements/new` adds one; `/admin/achievements/{id}` edits one. */
export default async function AdminAchievementPage({
  params,
}: PageProps<"/admin/achievements/[id]">) {
  const { id } = await params;
  const isNew = id === "new";
  const [achievement, categories, skillOptions] = await Promise.all([
    isNew ? EMPTY_ACHIEVEMENT : getAchievementForEdit(id),
    getCategories("achievement_categories"),
    getSkillOptions(),
  ]);
  if (!achievement) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">
        {isNew ? "Add achievement" : "Edit achievement"}
      </h1>
      <AchievementForm
        defaultValues={achievement}
        categories={categories}
        skillOptions={skillOptions}
      />
    </div>
  );
}
