import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import { StorageImage } from "./storage-image";

type OrgLogoProps = {
  /** Uploaded logo path in the media bucket. */
  src: string | null;
  name: string;
  /** Placeholder icon shown while no logo is uploaded (Case 01 §5.2). */
  fallbackIcon: LucideIcon;
  className?: string;
};

/** Company or school logo with a neutral placeholder. */
export function OrgLogo({ src, name, fallbackIcon: FallbackIcon, className }: OrgLogoProps) {
  return (
    <div
      className={cn(
        "relative flex size-12 items-center justify-center overflow-hidden rounded-xl border bg-secondary",
        className,
      )}
    >
      {src ? (
        <StorageImage path={src} alt={name} sizes="48px" className="object-contain p-1" />
      ) : (
        <FallbackIcon aria-hidden="true" className="size-5 text-muted-foreground" />
      )}
    </div>
  );
}
