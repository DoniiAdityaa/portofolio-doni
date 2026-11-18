import type { SimpleIcon } from "simple-icons";
import * as simpleIcons from "simple-icons";

import { cn } from "@/lib/utils/cn";

/** Below this relative luminance a brand color is unreadable on the dark background. */
const MIN_BRAND_LUMINANCE = 0.08;

/** Finds a Simple Icons entry by slug, e.g. "flutter" or "nextdotjs". */
export function findBrandIcon(slug: string): SimpleIcon | undefined {
  const exportName = `si${slug.charAt(0).toUpperCase()}${slug.slice(1).toLowerCase()}`;
  const icon = (simpleIcons as Record<string, unknown>)[exportName];
  return isSimpleIcon(icon) ? icon : undefined;
}

/**
 * Returns the brand color, or `undefined` when it is too dark to read on our
 * dark background (e.g. Next.js black); callers then use the text color.
 */
export function readableBrandColor(hex: string): string | undefined {
  const channels = [0, 2, 4].map((offset) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const [red = 0, green = 0, blue = 0] = channels;
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

  return luminance < MIN_BRAND_LUMINANCE ? undefined : `#${hex}`;
}

type BrandIconProps = {
  icon: SimpleIcon;
  /** Use the brand color instead of the current text color. */
  colored?: boolean;
  className?: string;
};

/** Renders a Simple Icons SVG. Decorative: pair it with visible text or an aria-label. */
export function BrandIcon({ icon, colored = false, className }: BrandIconProps) {
  const color = colored ? readableBrandColor(icon.hex) : undefined;

  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("size-5 shrink-0", className)}
      style={color ? { color } : undefined}
      fill="currentColor"
    >
      <path d={icon.path} />
    </svg>
  );
}

function isSimpleIcon(value: unknown): value is SimpleIcon {
  return typeof value === "object" && value !== null && "path" in value && "hex" in value;
}
