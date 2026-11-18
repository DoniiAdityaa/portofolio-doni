import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { getSiteSettings } from "@/features/settings/queries";

import { EndOfPage } from "./end-of-page";
import { MobileNav } from "./mobile-nav";
import { SidebarContent } from "./sidebar-content";

const MAIN_CONTENT_ID = "main-content";

/**
 * Page frame (Case 01 §3.4, CR-01): sidebar and content share one centered container,
 * with a sticky sidebar on tablet and desktop and a top bar + drawer on phones.
 */
export async function AppShell({ children }: { children: ReactNode }) {
  const t = await getTranslations("shell");
  const settings = await getSiteSettings();

  return (
    <>
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t("skipToContent")}
      </a>

      <MobileNav name={settings.name}>
        <SidebarContent settings={settings} />
      </MobileNav>

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-10 px-4 sm:px-6 lg:gap-14">
        <aside className="sticky top-0 hidden h-dvh w-[var(--width-sidebar)] shrink-0 overflow-y-auto py-8 md:block">
          <SidebarContent settings={settings} />
        </aside>

        <main
          id={MAIN_CONTENT_ID}
          tabIndex={-1}
          className="min-w-0 flex-1 py-8 outline-none md:py-12"
        >
          {children}
          <EndOfPage />
        </main>
      </div>
    </>
  );
}
