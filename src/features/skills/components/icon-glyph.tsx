import { Code2Icon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import type { IconPreview } from "../icon-preview";

/** Draws an icon preview sent from the server; a neutral icon when the slug is unknown. */
export function IconGlyph({ icon, className }: { icon: IconPreview | null; className?: string }) {
  if (!icon) {
    return (
      <Code2Icon aria-hidden="true" className={cn("size-5 text-muted-foreground", className)} />
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("size-5 shrink-0", className)}
      fill={icon.color ?? "currentColor"}
    >
      <path d={icon.path} />
    </svg>
  );
}
