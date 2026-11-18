"use client";

import { motion } from "motion/react";

/** Soft, slowly drifting sky/teal glows behind the page. Purely decorative. */
export function BackgroundGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] [background-size:28px_28px] opacity-40" />
      <motion.div
        className="absolute -top-40 left-1/4 size-[32rem] rounded-full bg-sky/10 blur-3xl"
        animate={{ x: [0, 60, -40, 0], y: [0, 40, 20, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-32 size-[28rem] rounded-full bg-teal/10 blur-3xl"
        animate={{ x: [0, -50, 30, 0], y: [0, -30, 40, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
