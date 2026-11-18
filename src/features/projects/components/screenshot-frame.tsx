import { cn } from "@/lib/utils/cn";

import type { ImageOrientation } from "../types";

type ScreenshotFrameProps = {
  orientation: ImageOrientation;
  label: string;
  /** Uploaded image path; images come from Supabase Storage in M5. */
  src: string | null;
  className?: string;
};

/**
 * A screenshot inside a phone frame (portrait) or a browser frame (landscape),
 * so mixed mobile and web screenshots keep their shape without distortion.
 */
export function ScreenshotFrame({ orientation, label, src, className }: ScreenshotFrameProps) {
  const portrait = orientation === "portrait";

  return (
    <div
      className={cn(
        "overflow-hidden border bg-background shadow-lg shadow-black/30",
        portrait ? "aspect-[9/19] rounded-[1.75rem] p-1.5" : "aspect-[16/10] rounded-lg",
        className,
      )}
    >
      {portrait ? null : (
        <div aria-hidden="true" className="flex h-6 items-center gap-1.5 border-b px-3">
          <span className="size-2 rounded-full bg-destructive/60" />
          <span className="size-2 rounded-full bg-amber/60" />
          <span className="size-2 rounded-full bg-teal/60" />
        </div>
      )}
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky/15 via-secondary to-teal/15",
          portrait ? "h-full rounded-[1.4rem]" : "h-[calc(100%-1.5rem)]",
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- replaced by next/image with Storage URLs in M5
          <img src={src} alt={label} className="size-full object-cover" />
        ) : (
          <span className="px-3 text-center font-mono text-xs text-muted-foreground">{label}</span>
        )}
      </div>
    </div>
  );
}
