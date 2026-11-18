"use client";

import { ChevronDownIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils/cn";

type ExpandableProps = {
  showLabel: string;
  hideLabel: string;
  children: ReactNode;
};

/** "Show details" toggle that smoothly reveals extra content (UI/UX reference). */
export function Expandable({ showLabel, hideLabel, children }: ExpandableProps) {
  const [open, setOpen] = useState(false);
  // True while the height animates. Content is clipped only then, so once open,
  // hover effects (e.g. a scaled skill chip) are not cut off at the edges.
  const [animating, setAnimating] = useState(false);
  const contentId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1 rounded-md text-xs text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ChevronDownIcon
          aria-hidden="true"
          className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")}
        />
        {open ? hideLabel : showLabel}
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={contentId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onAnimationStart={() => setAnimating(true)}
            onAnimationComplete={() => setAnimating(false)}
            className={animating ? "overflow-hidden" : "overflow-visible"}
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
