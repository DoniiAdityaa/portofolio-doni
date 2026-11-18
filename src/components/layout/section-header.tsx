import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  /** A Lucide icon, or any element (e.g. a brand icon) for special cases. */
  icon: LucideIcon | ReactNode;
  title: string;
  description?: string;
  /** Optional element on the right, e.g. a "view all" link. */
  action?: ReactNode;
  /** Id for the heading, so the section can reference it with aria-labelledby. */
  id?: string;
};

/** Heading for a section inside a page (e.g. Skills on Home). */
export function SectionHeader({ icon, title, description, action, id }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-1">
        <h2 id={id} className="flex items-center gap-2 text-xl font-semibold">
          {isLucideIcon(icon) ? <LucideGlyph icon={icon} /> : icon}
          {title}
        </h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

function isLucideIcon(icon: LucideIcon | ReactNode): icon is LucideIcon {
  return (
    typeof icon === "function" || (typeof icon === "object" && icon !== null && "render" in icon)
  );
}

function LucideGlyph({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon aria-hidden="true" className="size-5 text-primary" />;
}
