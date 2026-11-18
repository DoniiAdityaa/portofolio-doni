"use client";

import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useTransition } from "react";

import { Flag } from "@/components/ui/flag";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";

const LANGUAGE_NAMES = { en: "English", id: "Bahasa Indonesia" } as const;

/** EN / ID switch with flags that keeps the visitor on the same page (Case 01 §2). */
export function LanguageToggle() {
  const t = useTranslations("shell");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Separate id per instance, so the sidebar and the drawer animate independently.
  const pillId = useId();

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={cn(
        "relative inline-flex rounded-full border bg-secondary/60 p-0.5",
        isPending && "opacity-70",
      )}
    >
      {routing.locales.map((locale) => {
        const active = locale === activeLocale;

        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            aria-pressed={active}
            aria-label={LANGUAGE_NAMES[locale]}
            title={LANGUAGE_NAMES[locale]}
            disabled={isPending}
            onClick={() => {
              if (active) return;
              startTransition(() => router.replace(pathname, { locale }));
            }}
            className="relative flex h-6 w-9 items-center justify-center rounded-full transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95"
          >
            {active ? (
              <motion.span
                layoutId={pillId}
                className="absolute inset-0 rounded-full bg-primary shadow-md shadow-primary/30"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            ) : null}
            <Flag locale={locale} className="relative" />
          </button>
        );
      })}
    </div>
  );
}
