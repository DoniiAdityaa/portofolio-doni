import { StorageImage } from "@/components/ui/storage-image";
import { cn } from "@/lib/utils/cn";

type ProjectThumbnailProps = {
  title: string;
  /** Uploaded thumbnail; placeholder art is shown while it is empty. */
  path: string | null;
  priority?: boolean;
  className?: string;
};

/** The project's uploaded thumbnail, or placeholder art with its first letter. */
export function ProjectThumbnail({ title, path, priority, className }: ProjectThumbnailProps) {
  if (path) {
    return (
      <div className={cn("relative aspect-video overflow-hidden bg-secondary", className)}>
        <StorageImage
          path={path}
          alt=""
          sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  }

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
