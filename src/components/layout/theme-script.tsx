"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useRef } from "react";

import { themeInitScript } from "@/lib/theme/theme";

/**
 * Applies the saved theme before the first paint (CR-08), as the Next.js "preventing flash
 * before hydration" guide recommends: the script goes into the server HTML only, so React
 * never renders a <script> on the client (which it warns about). Once is enough, because
 * the attribute it sets on <html> persists across navigations.
 */
export function ThemeScript() {
  const inserted = useRef(false);

  useServerInsertedHTML(() => {
    if (inserted.current) return null;
    inserted.current = true;
    // Static, trusted script from our own code (no user input).
    return <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />;
  });

  return null;
}
