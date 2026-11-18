"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.65, 0, 0.35, 1] as const;
const WRITE_DURATION = 1.4;

/**
 * Handwritten name that "writes itself" left to right, then a pen stroke underlines it
 * (CR-03). Plays once when scrolled into view; static for reduced-motion visitors.
 */
export function Signature({ name }: { name: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="relative inline-block font-signature text-5xl leading-none text-primary">
      <motion.span
        className="inline-block pr-2"
        initial={reduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: WRITE_DURATION, ease: EASE }}
      >
        {name}
      </motion.span>
      <svg
        aria-hidden="true"
        viewBox="0 0 120 12"
        preserveAspectRatio="none"
        className="absolute -bottom-2 left-0 h-3 w-full overflow-visible text-primary"
      >
        <motion.path
          d="M2 8 C 30 2, 60 11, 90 5 S 115 6, 118 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: reduceMotion ? 0 : WRITE_DURATION - 0.2, ease: EASE }}
        />
      </svg>
    </span>
  );
}
