"use client";

import { ArrowUpIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";

/**
 * "You've reached the end" marker at the bottom of every page, with a back-to-top button.
 * The lines grow from the center when it scrolls into view.
 */
export function EndOfPage() {
  const t = useTranslations("shell");
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="mt-16 flex flex-col items-center gap-3 pb-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="flex w-full items-center gap-4">
        <motion.span
          aria-hidden="true"
          className="h-px flex-1 origin-right bg-gradient-to-l from-border to-transparent"
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.p
          className="font-mono text-xs tracking-wider text-muted-foreground uppercase"
          variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {t("endOfPage")}
        </motion.p>
        <motion.span
          aria-hidden="true"
          className="h-px flex-1 origin-left bg-gradient-to-r from-border to-transparent"
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
        className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ArrowUpIcon
          aria-hidden="true"
          className="size-3.5 transition-transform group-hover:-translate-y-0.5"
        />
        {t("backToTop")}
      </button>
    </motion.div>
  );
}
