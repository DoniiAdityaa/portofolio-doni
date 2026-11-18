"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const INTERVAL_MS = 2800;

/**
 * The owner's roles as a small status pill under the name (CR-08). A pulsing dot sits
 * beside the role, and each role flips in like a split-flap board. Hovering pauses it.
 * Reduced-motion visitors see the first role, static.
 */
export function RoleCard({ roles }: { roles: string[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const rotating = !reduceMotion && roles.length > 1;

  useEffect(() => {
    if (!rotating || paused) return;
    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % roles.length),
      INTERVAL_MS,
    );
    return () => window.clearTimeout(timer);
  }, [rotating, paused, index, roles.length]);

  const role = roles[index] ?? "";

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-primary transition-colors duration-300 hover:border-primary/70 hover:bg-primary/15"
    >
      <span className="sr-only">{roles.join(", ")}</span>

      <span aria-hidden="true" className="relative flex size-2">
        {rotating && !paused ? (
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
        ) : null}
        <span className="relative size-2 rounded-full bg-primary" />
      </span>

      <span aria-hidden="true" className="relative h-4 overflow-hidden [perspective:400px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={role}
            initial={{ rotateX: -90, opacity: 0, y: 6 }}
            animate={{ rotateX: 0, opacity: 1, y: 0 }}
            exit={{ rotateX: 90, opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="block text-xs leading-4 font-semibold whitespace-nowrap"
          >
            {role}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
