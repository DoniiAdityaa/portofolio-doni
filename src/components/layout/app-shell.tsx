import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { placeholderProfile } from "@/features/settings/placeholder-profile";

import { MobileNav } from "./mobile-nav";
import { SidebarContent } from "./sidebar-content";

const MAIN_CONTENT_ID = "main-content";

/**
 * Page frame (Case 01 §3.4): fixed left sidebar on tablet and desktop,
 * top bar + drawer on phones.
 */
export async function AppShell({ children }: { children: ReactNode }) {
  const t = await getTranslations("shell");
  const profile = placeholderProfile;

  return (
    <>
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t("skipToContent")}
      </a>

      <MobileNav name={profile.name}>
        <SidebarContent profile={profile} />
      </MobileNav>

      <aside className="fixed inset-y-0 left-0 hidden w-[var(--width-sidebar)] overflow-y-auto border-r bg-card md:block">
        <SidebarContent profile={profile} />
      </aside>

      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className="flex-1 outline-none md:pl-[var(--width-sidebar)]"
      >
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8 md:py-12">{children}</div>
      </main>
    </>
  );
}
