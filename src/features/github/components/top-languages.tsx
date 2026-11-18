"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";

import type { LanguageShare } from "../types";

/**
 * Most-used languages across public repositories (Case 01 §5.5):
 * a stacked bar that fills from left to right, plus a legend with percentages.
 */
export function TopLanguages({ languages }: { languages: LanguageShare[] }) {
  const t = useTranslations("dashboard");

  return (
    <div className="space-y-4">
      <div
        role="img"
        aria-label={t("languagesBarLabel")}
        className="flex h-3 w-full overflow-hidden rounded-full bg-secondary"
      >
        {languages.map((language, index) => (
          <motion.span
            key={language.name}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{ backgroundColor: language.color }}
            initial={{ width: 0 }}
            whileInView={{ width: `${language.percent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
          />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3">
        {languages.map((language) => (
          <li key={language.name} className="group flex items-center gap-2 text-sm">
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full transition-transform group-hover:scale-150"
              style={{ backgroundColor: language.color }}
            />
            <span>{language.name}</span>
            <span className="ml-auto font-mono text-xs text-muted-foreground">
              {language.percent.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
