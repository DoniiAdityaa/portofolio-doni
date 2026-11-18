import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { emptyProject, getProjectForEdit } from "@/features/projects/admin-queries";
import { ProjectForm } from "@/features/projects/components/project-form";
import { getSkillOptions } from "@/features/skills/admin-queries";
import { getCategories } from "@/lib/actions/category-rows";

export const metadata: Metadata = { title: "Edit project" };

/** `/admin/projects/new` adds a project; `/admin/projects/{id}` edits one. */
export default async function AdminProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const isNew = id === "new";
  const [types, categories, skillOptions, existing] = await Promise.all([
    getCategories("project_types"),
    getCategories("project_categories"),
    getSkillOptions(),
    isNew ? null : getProjectForEdit(id),
  ]);
  const project = isNew ? emptyProject(types[0]?.id, categories[0]?.id) : existing;
  if (!project) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">
        {isNew ? "Add project" : "Edit project"}
      </h1>
      <ProjectForm
        defaultValues={project}
        types={types}
        categories={categories}
        skillOptions={skillOptions}
      />
    </div>
  );
}
