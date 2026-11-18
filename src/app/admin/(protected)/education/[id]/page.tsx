import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EMPTY_EDUCATION, getEducationForEdit } from "@/features/education/admin-queries";
import { EducationForm } from "@/features/education/components/education-form";

export const metadata: Metadata = { title: "Edit education" };

/** `/admin/education/new` adds an entry; `/admin/education/{id}` edits one. */
export default async function AdminEducationEditPage({
  params,
}: PageProps<"/admin/education/[id]">) {
  const { id } = await params;
  const isNew = id === "new";
  const education = isNew ? EMPTY_EDUCATION : await getEducationForEdit(id);
  if (!education) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">
        {isNew ? "Add education" : "Edit education"}
      </h1>
      <EducationForm defaultValues={education} />
    </div>
  );
}
