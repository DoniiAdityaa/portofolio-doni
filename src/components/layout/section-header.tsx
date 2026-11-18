import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Optional element on the right, e.g. a "view all" link. */
  action?: ReactNode;
  /** Id for the heading, so the section can reference it with aria-labelledby. */
  id?: string;
};

/** Heading for a section inside a page (e.g. Skills on Home). */
export function SectionHeader({ icon: Icon, title, description, action, id }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-1">
        <h2 id={id} className="flex items-center gap-2 text-xl font-semibold">
          <Icon aria-hidden="true" className="size-5 text-primary" />
          {title}
        </h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
