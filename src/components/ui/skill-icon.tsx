import { Code2Icon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import { BrandIcon, findBrandIcon } from "./brand-icon";

type SkillIconProps = {
  /** Simple Icons slug picked in admin, e.g. "flutter". */
  slug: string;
  /** Visible label; also used for screen readers. */
  name: string;
  className?: string;
};

/** A skill shown as its official icon plus name (Case 01: icons, not text only). */
export function SkillIcon({ slug, name, className }: SkillIconProps) {
  const icon = findBrandIcon(slug);

  return (
    <span
      className={cn(
        "group inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm",
        "transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary/40",
        className,
      )}
    >
      {icon ? (
        <BrandIcon
          icon={icon}
          colored
          className="size-4 opacity-80 transition-opacity group-hover:opacity-100"
        />
      ) : (
        <Code2Icon aria-hidden="true" className="size-4 text-muted-foreground" />
      )}
      <span>{name}</span>
    </span>
  );
}
