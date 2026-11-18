import { cn } from "@/lib/utils/cn";

/**
 * Small inline flags for the language switch. SVG instead of emoji so they look
 * the same on every platform (Windows shows flag emoji as letters).
 */
export function Flag({ locale, className }: { locale: "en" | "id"; className?: string }) {
  const classes = cn(
    "h-3 w-[1.0625rem] shrink-0 overflow-hidden rounded-[2px] shadow-sm",
    className,
  );

  if (locale === "id") {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 14" className={classes}>
        <rect width="20" height="7" fill="#E70011" />
        <rect y="7" width="20" height="7" fill="#FFFFFF" />
      </svg>
    );
  }

  // Simplified US flag: stripes and a plain canton (recognizable at 20×14).
  return (
    <svg aria-hidden="true" viewBox="0 0 20 14" className={classes}>
      <rect width="20" height="14" fill="#FFFFFF" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <rect key={y} y={y} width="20" height="1.08" fill="#B22234" />
      ))}
      <rect width="9" height="7.5" fill="#3C3B6E" />
    </svg>
  );
}
