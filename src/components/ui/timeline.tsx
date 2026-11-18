import type { ReactNode } from "react";

import { SpotlightCard } from "@/components/motion/spotlight-card";
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

/**
 * One timeline entry. On hover the card lifts with a pointer spotlight,
 * the logo tilts, and the timeline dot pulses. Wrap it in an <li> (e.g. RevealItem as="li").
 */
export function TimelineItem({
  title,
  subtitle,
  period,
  media,
  badges,
  children,
}: TimelineItemProps) {
  return (
    <div className="group/item relative">
      <span aria-hidden="true" className="absolute top-2 -left-[1.82rem] flex size-2.5">
        <span className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover/item:animate-ping group-hover/item:opacity-40" />
        <span className="relative size-2.5 rounded-full bg-primary ring-4 ring-background transition-transform duration-300 group-hover/item:scale-125" />
      </span>
      <SpotlightCard className="flex gap-4 p-4 sm:p-5">
        {media ? (
          <div className="shrink-0 transition-transform duration-300 group-hover/item:-rotate-3">
            {media}
          </div>
        ) : null}
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-base font-medium transition-colors group-hover/item:text-primary">
            {title}
          </h3>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{period}</span>
            {badges}
          </div>
          {children ? <div className="pt-2 text-sm text-muted-foreground">{children}</div> : null}
        </div>
      </SpotlightCard>
    </div>
  );
}
