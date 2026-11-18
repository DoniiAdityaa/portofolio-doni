import { cn } from "@/lib/utils/cn";

type ProjectThumbnailProps = {
  title: string;
  className?: string;
};

/**
 * Placeholder artwork used while a project has no uploaded thumbnail (dummy data, M2).
 * M5 renders the uploaded image with next/image when `thumbnailPath` is set.
 */
export function ProjectThumbnail({ title, className }: ProjectThumbnailProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-sky/20 via-secondary to-teal/20",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
      <span className="relative font-heading text-4xl font-semibold text-foreground/80 transition-transform duration-500 group-hover:scale-110">
        {title.charAt(0)}
      </span>
    </div>
  );
}
