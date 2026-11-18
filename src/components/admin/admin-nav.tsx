"use client";

import {
  AwardIcon,
  BriefcaseIcon,
  Code2Icon,
  FileTextIcon,
  FolderGitIcon,
  InboxIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  type LucideIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";

type AdminNavItem = { href: string; label: string; icon: LucideIcon };

/** Admin modules (Case 03 M4). */
const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboardIcon },
  { href: "/admin/settings", label: "Site settings", icon: SettingsIcon },
  { href: "/admin/skills", label: "Skills", icon: Code2Icon },
  { href: "/admin/career", label: "Career", icon: BriefcaseIcon },
  { href: "/admin/education", label: "Education", icon: GraduationCapIcon },
  { href: "/admin/achievements", label: "Achievements", icon: AwardIcon },
  { href: "/admin/projects", label: "Projects", icon: FolderGitIcon },
  { href: "/admin/cv", label: "CV", icon: FileTextIcon },
  { href: "/admin/inbox", label: "Inbox", icon: InboxIcon },
  { href: "/admin/trash", label: "Trash", icon: Trash2Icon },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation" className="flex flex-col gap-1">
      {ADMIN_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
              active && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
            )}
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
