import type { LucideIcon } from "lucide-react";
import { InboxIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  /** Optional action, e.g. a "reset filters" button. */
  action?: ReactNode;
  className?: string;
};

/** Friendly placeholder shown when a list or section has nothing to display. */
export function EmptyState({
  title,
  description,
  icon: Icon = InboxIcon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-8 text-muted-foreground" />
      <div className="space-y-1">
        <p className="font-heading text-base font-medium">{title}</p>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
