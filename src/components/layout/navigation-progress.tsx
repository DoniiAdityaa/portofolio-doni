"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** How far the bar creeps while waiting, as a share of the screen width. */
const MAX_WAITING_PROGRESS = 0.9;

type Phase = "idle" | "loading" | "done";

/**
 * Thin sky-colored bar at the top of the screen while moving between pages
 * (like YouTube's red bar, CR-08). It starts when an internal link is clicked
 * and finishes when the new page's path is active.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const startPath = useRef(pathname);

  // Start on clicks to internal links that lead somewhere else.
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      const sameOrigin = url.origin === window.location.origin;
      if (!sameOrigin || url.pathname === window.location.pathname) return;

      startPath.current = window.location.pathname;
      setProgress(0.15);
      setPhase("loading");
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  // Creep forward while waiting, slowing down as it gets closer to the end.
  useEffect(() => {
    if (phase !== "loading") return;
    const timer = window.setInterval(() => {
      setProgress((value) => value + (MAX_WAITING_PROGRESS - value) * 0.1);
    }, 200);
    return () => window.clearInterval(timer);
  }, [phase]);

  // Finish once the new path is shown, then fade out.
  useEffect(() => {
    if (phase !== "loading" || pathname === startPath.current) return;
    const finish = window.setTimeout(() => {
      setProgress(1);
      setPhase("done");
    }, 0);
    return () => window.clearTimeout(finish);
  }, [pathname, phase]);

  useEffect(() => {
    if (phase !== "done") return;
    const hide = window.setTimeout(() => {
      setPhase("idle");
      setProgress(0);
    }, 400);
    return () => window.clearTimeout(hide);
  }, [phase]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5"
      style={{ opacity: phase === "idle" ? 0 : 1, transition: "opacity 300ms ease" }}
    >
      <div
        className="h-full origin-left bg-primary shadow-[0_0_10px_var(--sky),0_0_4px_var(--sky)]"
        style={{
          transform: `scaleX(${progress})`,
          transition: "transform 200ms ease-out",
        }}
      />
    </div>
  );
}
