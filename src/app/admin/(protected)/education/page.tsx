import type { Metadata } from "next";

import { ContentList } from "@/components/admin/content-list";
import {
  archiveEducation,
  reorderEducations,
  resetEducationOrder,
  setEducationStatus,
} from "@/features/education/actions";
import { getEducationsForAdmin } from "@/features/education/admin-queries";

export const metadata: Metadata = { title: "Education" };

export default async function AdminEducationPage() {
  const { items, hasManualOrder } = await getEducationsForAdmin();

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Education</h1>
        <p className="text-muted-foreground">
          Newest first by default. Drag to set your own order.
        </p>
      </div>
      <ContentList
        label="Education entries"
        items={items}
        basePath="/admin/education"
        addLabel="Add education"
        hasManualOrder={hasManualOrder}
        actions={{
          setStatus: setEducationStatus,
          archive: archiveEducation,
          reorder: reorderEducations,
          resetOrder: resetEducationOrder,
        }}
      />
    </div>
  );
}
