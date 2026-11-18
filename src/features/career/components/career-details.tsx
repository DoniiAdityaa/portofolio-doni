"use client";

import type { LucideIcon } from "lucide-react";
import { CheckIcon, LightbulbIcon, ListChecksIcon, RocketIcon } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type CareerDetailsProps = {
  labels: { responsibilities: string; learned: string; impact: string; techUsed: string };
  responsibilities: string[];
  learnings: string[];
  impact: string[];
  /** Tech chips, rendered on the server. */
  techStack?: ReactNode;
};

const listVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

/**
 * Expanded career details (CR-04): Responsibilities, then What I learned and Impact
 * side by side. Each block's icon has its own hover animation.
 */
export function CareerDetails({
  labels,
  responsibilities,
  learnings,
  impact,
  techStack,
}: CareerDetailsProps) {
  return (
    <div className="space-y-5">
      <DetailBlock
        icon={ListChecksIcon}
        iconClassName="group-hover/block:-rotate-12 group-hover/block:scale-110"
        title={labels.responsibilities}
        items={responsibilities}
      />

      {learnings.length > 0 || impact.length > 0 ? (
        <div className="grid gap-5 border-t pt-5 md:grid-cols-2">
          <DetailBlock
            icon={LightbulbIcon}
            iconClassName="group-hover/block:scale-110 group-hover/block:fill-amber/30 group-hover/block:drop-shadow-[0_0_6px_var(--amber)]"
            title={labels.learned}
            items={learnings}
          />
          <DetailBlock
            icon={RocketIcon}
            iconClassName="group-hover/block:translate-x-1 group-hover/block:-translate-y-1 group-hover/block:rotate-12"
            title={labels.impact}
            items={impact}
          />
        </div>
      ) : null}

      {techStack ? (
        <div className="space-y-2 border-t pt-5">
          <p className="text-xs font-semibold tracking-wider text-foreground uppercase">
            {labels.techUsed}
          </p>
          {techStack}
        </div>
      ) : null}
    </div>
  );
}

type DetailBlockProps = {
  icon: LucideIcon;
  iconClassName: string;
  title: string;
  items: string[];
};

function DetailBlock({ icon: Icon, iconClassName, title, items }: DetailBlockProps) {
  if (items.length === 0) return null;

  return (
    <div className="group/block space-y-3">
      <h4 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-foreground uppercase">
        <Icon
          aria-hidden="true"
          className={cn("size-4 transition-all duration-300 ease-out", iconClassName)}
        />
        {title}
      </h4>
      <motion.ul className="space-y-2" variants={listVariants} initial="hidden" animate="visible">
        {items.map((item) => (
          <motion.li key={item} variants={itemVariants} className="group/line flex gap-2.5">
            <CheckIcon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover/line:scale-125"
            />
            <span className="transition-colors group-hover/line:text-foreground">{item}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
