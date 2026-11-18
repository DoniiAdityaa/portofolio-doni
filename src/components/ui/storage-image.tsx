import Image from "next/image";

import { publicFileUrl } from "@/lib/supabase/storage";
import { cn } from "@/lib/utils/cn";

/**
 * An uploaded image from the public media bucket, resized and served in modern formats
 * by next/image (Case 02 §9). It fills its positioned parent.
 */
export function StorageImage({
  path,
  alt,
  sizes,
  className,
  priority = false,
}: {
  path: string;
  alt: string;
  /** Rendered width hint for responsive sizes, e.g. "48px" or "(min-width: 768px) 50vw, 100vw". */
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const src = publicFileUrl(path);
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
