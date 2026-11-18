import { cn } from "@/lib/utils/cn";

/**
 * Profile photo with a slowly rotating sky/teal ring.
 * Shows initials until Site Settings provide the real photo (M4/M5).
 */
export function ProfileAvatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("group relative size-24", className)}>
      <div className="absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,var(--sky),var(--teal),transparent,var(--sky))] opacity-80 blur-[2px] transition-opacity group-hover:opacity-100" />
      <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-card font-heading text-3xl font-semibold transition-transform duration-300 group-hover:scale-95">
        {initials}
      </div>
    </div>
  );
}
