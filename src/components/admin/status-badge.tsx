import type { PublicationStatus } from "@/lib/content/types";
import { cn } from "@/lib/utils/cn";

/** Draft / Published label for admin lists. */
export function StatusBadge({ status }: { status: PublicationStatus }) {
  const published = status === "published";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        published
          ? "border-teal/40 bg-teal/10 text-teal"
          : "border-border bg-secondary text-muted-foreground",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", published ? "bg-teal" : "bg-muted-foreground")}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}
