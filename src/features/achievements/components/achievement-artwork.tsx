import { AwardIcon, TrophyIcon } from "lucide-react";

import { StorageImage } from "@/components/ui/storage-image";
import { cn } from "@/lib/utils/cn";

import type { AchievementType } from "../types";

type AchievementArtworkProps = {
  type: AchievementType;
  issuer: string;
  /** Uploaded certificate image; placeholder art is shown while it is empty. */
  imagePath: string | null;
  className?: string;
};

/** The uploaded certificate or award image, or placeholder art until one exists. */
export function AchievementArtwork({
  type,
  issuer,
  imagePath,
  className,
}: AchievementArtworkProps) {
  if (imagePath) {
    return (
      <div className={cn("relative aspect-[4/3] overflow-hidden bg-secondary/60", className)}>
        <StorageImage
          path={imagePath}
          alt=""
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  }

  const Icon = type === "award" ? TrophyIcon : AwardIcon;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex aspect-[4/3] flex-col items-center justify-center gap-3 overflow-hidden bg-secondary/60 p-4 text-center",
        className,
      )}
    >
      <div className="absolute inset-3 rounded-md border border-dashed border-border" />
      <Icon
        className={cn(
          "size-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6",
          type === "award" ? "text-amber" : "text-primary",
        )}
      />
      <span className="relative font-mono text-xs tracking-wide text-muted-foreground uppercase">
        {issuer}
      </span>
    </div>
  );
}
