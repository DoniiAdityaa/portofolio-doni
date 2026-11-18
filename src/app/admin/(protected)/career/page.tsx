import type { Metadata } from "next";

import { ContentList } from "@/components/admin/content-list";
import {
  archiveExperience,
  reorderExperiences,
  resetExperienceOrder,
  setExperienceStatus,
} from "@/features/career/actions";
import { getExperiencesForAdmin } from "@/features/career/admin-queries";

export const metadata: Metadata = { title: "Career" };

export default async function AdminCareerPage() {
  const { items, hasManualOrder } = await getExperiencesForAdmin();

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Career</h1>
        <p className="text-muted-foreground">
          Newest first by default. Drag to set your own order.
        </p>
      </div>
      <ContentList
        label="Career entries"
        items={items}
        basePath="/admin/career"
        addLabel="Add experience"
        hasManualOrder={hasManualOrder}
        actions={{
          setStatus: setExperienceStatus,
          archive: archiveExperience,
          reorder: reorderExperiences,
          resetOrder: resetExperienceOrder,
        }}
      />
    </div>
  );
}
