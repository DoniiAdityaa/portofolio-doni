"use client";

import { motion } from "motion/react";
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

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.025 } },
};

const chipVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

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
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200 active:scale-95",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                // A sliding highlight (layout animation) misplaced itself while the chip list
                // below changed height, so the selected pill simply transitions its colors.
                selected
                  ? "border-transparent bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
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

      {/*
        Re-keyed per tab: the old list is swapped out at once and the new chips fade in
        one after another. Moving chips between positions (layout animation) caused
        overlapping jumps when switching tabs, so it is intentionally not used here.
      */}
      <motion.ul
        key={active}
        className="flex flex-wrap gap-2.5"
        initial="hidden"
        animate="visible"
        variants={listVariants}
      >
        {visible.map((chip) => (
          <motion.li key={chip.id} variants={chipVariants}>
            {chip.node}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
