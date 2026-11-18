"use client";

import { ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useId } from "react";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";

import { isActiveNavItem, NAV_ITEMS } from "./nav-items";

/** Main navigation; the highlight slides to the current page. */
export function NavMenu() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  // Separate id per instance, so the sidebar and the drawer animate independently.
  const indicatorId = useId();

  return (
    <nav aria-label={t("label")}>
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActiveNavItem(item, pathname);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  active
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId={indicatorId}
                    className="absolute inset-0 rounded-lg bg-secondary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                ) : (
                  <span className="absolute inset-0 rounded-lg transition-colors group-hover:bg-secondary/50" />
                )}
                <Icon
                  aria-hidden="true"
                  className={cn(
                    "relative size-4 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6",
                    active && "text-primary",
                  )}
                />
                <span className="relative transition-transform duration-200 group-hover:translate-x-0.5">
                  {t(item.labelKey)}
                </span>
                <ArrowRightIcon
                  aria-hidden="true"
                  className={cn(
                    "relative ml-auto size-4 transition-all duration-200",
                    active
                      ? "translate-x-0 text-muted-foreground opacity-100"
                      : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
