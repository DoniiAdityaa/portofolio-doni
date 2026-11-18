"use client";

import {
  ArchiveIcon,
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
  PlusIcon,
  RotateCcwIcon,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/actions/result";
import type { PublicationStatus } from "@/lib/content/types";
import { publicFileUrl } from "@/lib/supabase/storage";

import { ConfirmButton } from "./confirm-button";
import { SortableList } from "./sortable-list";
import { StatusBadge } from "./status-badge";
import { useAdminAction } from "./use-admin-action";

export type ContentListItem = {
  id: string;
  title: string;
  subtitle?: string;
  status: PublicationStatus;
  imagePath?: string | null;
};

/** Server actions a content list needs; they are passed in from the page. */
export type ContentListActions = {
  setStatus: (input: { id: string; status: PublicationStatus }) => Promise<ActionResult>;
  archive: (input: { id: string }) => Promise<ActionResult>;
  reorder: (input: { ids: string[] }) => Promise<ActionResult>;
  resetOrder: () => Promise<ActionResult>;
};

/**
 * Admin list for content tables (Case 03 M4 shared pattern): drag to set a manual order,
 * publish/unpublish, edit on its own page, and archive to Trash.
 */
export function ContentList({
  label,
  items,
  basePath,
  addLabel,
  hasManualOrder,
  actions,
}: {
  label: string;
  items: ContentListItem[];
  /** e.g. "/admin/career": edit pages live at `${basePath}/${id}`, new at `${basePath}/new`. */
  basePath: string;
  addLabel: string;
  hasManualOrder: boolean;
  actions: ContentListActions;
}) {
  const { run, pending } = useAdminAction();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button asChild>
          <Link href={`${basePath}/new`}>
            <PlusIcon aria-hidden="true" />
            {addLabel}
          </Link>
        </Button>
        {hasManualOrder ? (
          <ConfirmButton
            title="Go back to date order?"
            description="The manual order is cleared and items are sorted by date, newest first."
            confirmLabel="Reset order"
            onConfirm={() => run(actions.resetOrder, "Sorted by date.")}
            trigger={
              <Button variant="ghost" size="sm" disabled={pending}>
                <RotateCcwIcon aria-hidden="true" />
                Reset to date order
              </Button>
            }
          />
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          Nothing here yet.
        </p>
      ) : (
        <SortableList
          label={label}
          items={items}
          onReorder={(ids) => run(() => actions.reorder({ ids }), "Order saved.")}
          renderItem={(item) => {
            const published = item.status === "published";
            const imageUrl = item.imagePath ? publicFileUrl(item.imagePath) : null;

            return (
              <>
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail
                  <img src={imageUrl} alt="" className="size-8 shrink-0 rounded object-contain" />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.title}</p>
                  {item.subtitle ? (
                    <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                  ) : null}
                </div>
                <StatusBadge status={item.status} />
                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={pending}
                    aria-label={published ? `Unpublish ${item.title}` : `Publish ${item.title}`}
                    title={published ? "Unpublish" : "Publish"}
                    onClick={() =>
                      run(
                        () =>
                          actions.setStatus({
                            id: item.id,
                            status: published ? "draft" : "published",
                          }),
                        published ? "Moved to draft." : "Published.",
                      )
                    }
                  >
                    {published ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={`${basePath}/${item.id}`}
                      aria-label={`Edit ${item.title}`}
                      title="Edit"
                    >
                      <PencilIcon aria-hidden="true" />
                    </Link>
                  </Button>
                  <ConfirmButton
                    title={`Archive "${item.title}"?`}
                    description="It disappears from the site and moves to Trash, where you can restore it."
                    confirmLabel="Archive"
                    onConfirm={() => run(() => actions.archive({ id: item.id }), "Moved to Trash.")}
                    trigger={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={pending}
                        aria-label={`Archive ${item.title}`}
                        title="Archive"
                      >
                        <ArchiveIcon aria-hidden="true" />
                      </Button>
                    }
                  />
                </div>
              </>
            );
          }}
        />
      )}
    </div>
  );
}
