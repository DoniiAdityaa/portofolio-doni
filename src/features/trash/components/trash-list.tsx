"use client";

import { ArchiveRestoreIcon, Trash2Icon } from "lucide-react";

import { ConfirmButton } from "@/components/admin/confirm-button";
import { useAdminAction } from "@/components/admin/use-admin-action";
import { Button } from "@/components/ui/button";

import { deleteTrashItem, restoreTrashItem } from "../actions";
import { CONTENT_KIND_LABELS } from "../labels";
import type { TrashItem } from "../queries";

const DATE_FORMAT = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

/** Archived content: restore it, or delete it permanently with its files. */
export function TrashList({ items }: { items: TrashItem[] }) {
  const { run, pending } = useAdminAction();

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        Trash is empty.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li
          key={`${item.table}-${item.id}`}
          className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2"
        >
          <span className="shrink-0 rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
            {CONTENT_KIND_LABELS[item.table]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">
              Archived {DATE_FORMAT.format(new Date(item.deletedAt))}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() =>
              run(() => restoreTrashItem({ table: item.table, id: item.id }), "Restored.")
            }
          >
            <ArchiveRestoreIcon aria-hidden="true" />
            Restore
          </Button>
          <ConfirmButton
            title={`Delete "${item.title}" permanently?`}
            description="It is removed from the database together with its uploaded images. This cannot be undone."
            confirmLabel="Delete permanently"
            destructive
            onConfirm={() =>
              run(() => deleteTrashItem({ table: item.table, id: item.id }), "Deleted permanently.")
            }
            trigger={
              <Button
                variant="ghost"
                size="icon"
                disabled={pending}
                aria-label={`Delete ${item.title} permanently`}
                title="Delete permanently"
              >
                <Trash2Icon aria-hidden="true" />
              </Button>
            }
          />
        </li>
      ))}
    </ul>
  );
}
