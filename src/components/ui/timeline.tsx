import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/** Vertical timeline for Career and Education (Case 01 §5.2). Newest item first. */
export function Timeline({ children, className }: { children: ReactNode; className?: string }) {
  return <ol className={cn("relative space-y-6 border-l pl-6", className)}>{children}</ol>;
}

type TimelineItemProps = {
  title: string;
  subtitle?: string;
  /** Already formatted, e.g. "Jul 2025 – Present". */
  period: string;
  /** Logo element (image or placeholder). */
  media?: ReactNode;
  /** Small labels such as "Internship". */
  badges?: ReactNode;
  children?: ReactNode;
};

export function TimelineItem({
  title,
  subtitle,
  period,
  media,
  badges,
  children,
}: TimelineItemProps) {
  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className="absolute top-2 -left-[1.82rem] size-2.5 rounded-full bg-primary ring-4 ring-background"
      />
      <div className="flex gap-4 rounded-xl border bg-card p-4">
        {media ? <div className="shrink-0">{media}</div> : null}
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-base font-medium">{title}</h3>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{period}</span>
            {badges}
          </div>
          {children ? <div className="pt-2 text-sm text-muted-foreground">{children}</div> : null}
        </div>
      </div>
    </li>
  );
}
