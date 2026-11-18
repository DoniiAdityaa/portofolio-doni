import type { Metadata } from "next";

import { TrashList } from "@/features/trash/components/trash-list";
import { getTrashItems } from "@/features/trash/queries";

export const metadata: Metadata = { title: "Trash" };

export default async function AdminTrashPage() {
  const items = await getTrashItems();

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Trash</h1>
        <p className="text-muted-foreground">
          Archived content is hidden from the site. Restore it, or delete it for good.
        </p>
      </div>
      <TrashList items={items} />
    </div>
  );
}
