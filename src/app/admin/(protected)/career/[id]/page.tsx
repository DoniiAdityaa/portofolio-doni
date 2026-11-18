import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EMPTY_EXPERIENCE, getExperienceForEdit } from "@/features/career/admin-queries";
import { ExperienceForm } from "@/features/career/components/experience-form";
import { getSkillOptions } from "@/features/skills/admin-queries";

export const metadata: Metadata = { title: "Edit experience" };

/** `/admin/career/new` adds an entry; `/admin/career/{id}` edits one. */
export default async function AdminExperiencePage({ params }: PageProps<"/admin/career/[id]">) {
  const { id } = await params;
  const isNew = id === "new";
  const [experience, skillOptions] = await Promise.all([
    isNew ? EMPTY_EXPERIENCE : getExperienceForEdit(id),
    getSkillOptions(),
  ]);
  if (!experience) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">
        {isNew ? "Add experience" : "Edit experience"}
      </h1>
      <ExperienceForm defaultValues={experience} skillOptions={skillOptions} />
    </div>
  );
}
