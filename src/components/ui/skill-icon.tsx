import { Code2Icon } from "lucide-react";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils/cn";

import { BrandIcon, findBrandIcon, readableBrandColor } from "./brand-icon";

type SkillIconProps = {
  /** Simple Icons slug picked in admin, e.g. "flutter". */
  slug: string;
  /** Visible label; also used for screen readers. */
  name: string;
  className?: string;
};

/**
 * A skill chip: official icon plus name, tinted with the brand's color (Case 01, CR-01).
 * Falls back to a neutral chip when the icon or a readable brand color is missing.
 */
export function SkillIcon({ slug, name, className }: SkillIconProps) {
  const icon = findBrandIcon(slug);
  const brandColor = icon ? readableBrandColor(icon.hex) : undefined;
  const tint: CSSProperties | undefined = brandColor
    ? {
        backgroundColor: `color-mix(in oklab, ${brandColor} 12%, transparent)`,
        borderColor: `color-mix(in oklab, ${brandColor} 30%, transparent)`,
      }
    : undefined;

  return (
    <span
      style={tint}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border bg-secondary/60 px-3 py-1.5 text-sm",
        "transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg hover:shadow-black/20",
        className,
      )}
    >
      {icon ? (
        <BrandIcon
          icon={icon}
          colored
          className="size-4 transition-transform duration-300 group-hover:rotate-12"
        />
      ) : (
        <Code2Icon aria-hidden="true" className="size-4 text-muted-foreground" />
      )}
      <span>{name}</span>
    </span>
  );
}
