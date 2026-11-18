"use client";

import { Loader2Icon, SaveIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { PublicationStatus } from "@/lib/content/types";

/**
 * Sticky footer for admin edit pages: Published toggle, Cancel, and Save.
 * `onStatusChange` is wired to the form's `status` field.
 */
export function FormActions({
  status,
  onStatusChange,
  cancelHref,
  submitting,
}: {
  status: PublicationStatus;
  onStatusChange: (status: PublicationStatus) => void;
  cancelHref: string;
  submitting: boolean;
}) {
  return (
    <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center justify-between gap-3 border-t bg-background/90 px-1 py-3 backdrop-blur">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="size-4 accent-primary"
          checked={status === "published"}
          onChange={(event) => onStatusChange(event.target.checked ? "published" : "draft")}
        />
        Published (visible on the site)
      </label>
      <div className="flex gap-2">
        <Button variant="ghost" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <Loader2Icon aria-hidden="true" className="animate-spin" />
          ) : (
            <SaveIcon aria-hidden="true" />
          )}
          Save
        </Button>
      </div>
    </div>
  );
}
