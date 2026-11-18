import type { Metadata } from "next";

import { CategoryManager } from "@/components/admin/category-manager";
import { ContentList } from "@/components/admin/content-list";
import {
  archiveProject,
  deleteProjectCategory,
  deleteProjectType,
  reorderProjectCategories,
  reorderProjects,
  reorderProjectTypes,
  resetProjectOrder,
  saveProjectCategory,
  saveProjectType,
  setProjectStatus,
} from "@/features/projects/actions";
import { getProjectsForAdmin } from "@/features/projects/admin-queries";
import { FEATURED_PROJECTS_LIMIT } from "@/features/projects/constants";
import { getCategories } from "@/lib/actions/category-rows";

export const metadata: Metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  const [{ items, hasManualOrder }, types, categories] = await Promise.all([
    getProjectsForAdmin(),
    getCategories("project_types"),
    getCategories("project_categories"),
  ]);

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Projects</h1>
          <p className="text-muted-foreground">
            ★ marks featured projects (up to {FEATURED_PROJECTS_LIMIT} on Home). Newest first by
            default; drag to set your own order.
          </p>
        </div>
        <ContentList
          label="Projects"
          items={items}
          basePath="/admin/projects"
          addLabel="Add project"
          hasManualOrder={hasManualOrder}
          actions={{
            setStatus: setProjectStatus,
            archive: archiveProject,
            reorder: reorderProjects,
            resetOrder: resetProjectOrder,
          }}
        />
      </div>

      <div className="grid gap-10 border-t pt-6">
        <CategoryManager
          title="Types"
          description="The platform, e.g. Mobile or Web. Used by the Type filter."
          singular="type"
          categories={types}
          actions={{
            save: saveProjectType,
            remove: deleteProjectType,
            reorder: reorderProjectTypes,
          }}
        />
        <CategoryManager
          title="Categories"
          description="The context, e.g. Personal or Internship. Used by the Category filter."
          singular="category"
          categories={categories}
          actions={{
            save: saveProjectCategory,
            remove: deleteProjectCategory,
            reorder: reorderProjectCategories,
          }}
        />
      </div>
    </div>
  );
}
