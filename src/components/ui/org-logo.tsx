import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

type OrgLogoProps = {
  /** Uploaded logo path; images are wired to Supabase Storage in M5. */
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
        "flex size-12 items-center justify-center overflow-hidden rounded-xl border bg-secondary",
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- replaced by next/image with Storage URLs in M5
        <img src={src} alt={name} className="size-full object-cover" />
      ) : (
        <FallbackIcon aria-hidden="true" className="size-5 text-muted-foreground" />
      )}
    </div>
  );
}
