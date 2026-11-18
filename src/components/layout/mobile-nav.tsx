"use client";

import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "@/lib/i18n/navigation";

type MobileNavProps = {
  name: string;
  /** The sidebar content, rendered on the server and shown inside the drawer. */
  children: ReactNode;
};

/** Phone layout: top bar with the name and a menu button that opens a side drawer. */
export function MobileNav({ name, children }: MobileNavProps) {
  const t = useTranslations("shell");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedOn, setOpenedOn] = useState(pathname);

  // Close the drawer after navigating to another page.
  if (open && pathname !== openedOn) setOpen(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:hidden">
      <span className="font-heading font-semibold">{name}</span>
      <Sheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) setOpenedOn(pathname);
        }}
      >
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={t("openMenu")}>
            <MenuIcon aria-hidden="true" className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[var(--width-sidebar)] bg-card p-0">
          <SheetTitle className="sr-only">{t("menuTitle")}</SheetTitle>
          {children}
        </SheetContent>
      </Sheet>
    </header>
  );
}
