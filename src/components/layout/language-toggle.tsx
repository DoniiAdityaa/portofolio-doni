"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";

/** EN / ID switch that keeps the visitor on the same page (Case 01 §2). */
export function LanguageToggle() {
  const t = useTranslations("shell");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={cn("inline-flex rounded-lg border bg-background p-0.5", isPending && "opacity-70")}
    >
      {routing.locales.map((locale) => {
        const active = locale === activeLocale;

        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            aria-pressed={active}
            disabled={isPending}
            onClick={() => {
              if (active) return;
              startTransition(() => router.replace(pathname, { locale }));
            }}
            className={cn(
              "rounded-md px-3 py-1 font-mono text-xs uppercase transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {locale}
          </button>
        );
      })}
    </div>
  );
}
