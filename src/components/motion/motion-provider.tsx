"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Turns every Motion animation off when the visitor prefers reduced motion. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
