"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/lib/utils/cn";

export type SkillFilterTab = { id: string; label: string };

export type SkillFilterChip = {
  id: string;
  categoryId: string;
  /** The chip, rendered on the server so icon data never ships to the browser. */
  node: ReactNode;
};

type SkillFilterProps = {
  allLabel: string;
  filterLabel: string;
  tabs: SkillFilterTab[];
  chips: SkillFilterChip[];
};

const ALL = "all";

/** Category pills with counts (UI/UX reference) and an animated, filtered chip list. */
export function SkillFilter({ allLabel, filterLabel, tabs, chips }: SkillFilterProps) {
  const [active, setActive] = useState(ALL);
  const visible = active === ALL ? chips : chips.filter((chip) => chip.categoryId === active);
  const allTabs = [{ id: ALL, label: allLabel }, ...tabs];

  return (
    <div className="space-y-5">
      <div role="group" aria-label={filterLabel} className="flex flex-wrap gap-2">
        {allTabs.map((tab) => {
          const count =
            tab.id === ALL ? chips.length : chips.filter((c) => c.categoryId === tab.id).length;
          const selected = tab.id === active;

          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(tab.id)}
              className={cn(
                "relative inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                selected
                  ? "border-transparent text-primary-foreground"
                  : "text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {selected ? (
                <motion.span
                  layoutId="skill-filter-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              ) : null}
              <span className="relative">{tab.label}</span>
              <span
                className={cn(
                  "relative rounded-full px-1.5 font-mono text-xs",
                  selected ? "bg-primary-foreground/15" : "bg-secondary",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <motion.ul layout className="flex flex-wrap gap-2.5">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((chip, index) => (
            <motion.li
              key={chip.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25, delay: Math.min(index * 0.015, 0.3) }}
            >
              {chip.node}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
