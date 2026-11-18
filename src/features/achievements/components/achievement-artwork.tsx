import { AwardIcon, TrophyIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import type { AchievementType } from "../types";

type AchievementArtworkProps = {
  type: AchievementType;
  issuer: string;
  className?: string;
};

/**
 * Placeholder art shown until a certificate or award image is uploaded (dummy data, M2).
 * M5 shows the uploaded image with next/image when `imagePath` is set.
 */
export function AchievementArtwork({ type, issuer, className }: AchievementArtworkProps) {
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
