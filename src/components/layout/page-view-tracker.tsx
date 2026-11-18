"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";

/** Sends one anonymous page view per navigation to /api/track (Case 02 §10.2). */
export function PageViewTracker() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, locale, referrer: document.referrer || undefined }),
      keepalive: true,
    }).catch(() => {
      // Tracking must never disturb the visitor.
    });
  }, [pathname, locale]);

  return null;
}
