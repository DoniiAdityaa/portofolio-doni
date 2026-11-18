"use client";

import type { PointerEvent, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Card with a soft sky light that follows the pointer while hovered.
 * The light is a CSS radial gradient positioned by two custom properties.
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      className={cn(
        "group/spotlight relative isolate overflow-hidden rounded-xl border bg-card",
        "transition-[transform,border-color,box-shadow] duration-300 ease-out",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-black/20",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, var(--sky) 12%, transparent), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
