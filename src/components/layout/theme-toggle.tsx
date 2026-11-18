"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useId, useSyncExternalStore } from "react";

import type { Theme } from "@/lib/theme/theme";
import { applyTheme, DEFAULT_THEME, readTheme, subscribeToTheme } from "@/lib/theme/theme";

const OPTIONS: { theme: Theme; icon: typeof SunIcon }[] = [
  { theme: "light", icon: SunIcon },
  { theme: "dark", icon: MoonIcon },
];

/** Light / dark switch (CR-08). The choice is remembered for the next visit. */
export function ThemeToggle() {
  const t = useTranslations("shell");
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, () => DEFAULT_THEME);
  // Separate id per instance, so the sidebar and the drawer animate independently.
  const pillId = useId();

  return (
    <div
      role="group"
      aria-label={t("theme")}
      className="inline-flex rounded-full border bg-secondary/60 p-0.5"
    >
      {OPTIONS.map(({ theme: option, icon: Icon }) => {
        const active = option === theme;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            aria-label={t(option === "light" ? "lightMode" : "darkMode")}
            title={t(option === "light" ? "lightMode" : "darkMode")}
            onClick={() => applyTheme(option)}
            className="relative flex h-6 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95"
          >
            {active ? (
              <motion.span
                layoutId={pillId}
                className="absolute inset-0 rounded-full bg-card shadow-md ring-1 ring-border"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            ) : null}
            <Icon
              aria-hidden="true"
              className={
                active
                  ? "relative size-3.5 rotate-0 text-foreground transition-transform duration-500"
                  : "relative size-3.5 -rotate-45 transition-transform duration-500"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
