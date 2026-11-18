import type { LucideIcon } from "lucide-react";
import {
  AwardIcon,
  FolderGit2Icon,
  HouseIcon,
  LayoutDashboardIcon,
  MailIcon,
  UserRoundIcon,
} from "lucide-react";

export type NavItem = {
  /** Key in the `nav` message namespace. */
  labelKey: "home" | "about" | "achievements" | "projects" | "dashboard" | "contact";
  href: string;
  icon: LucideIcon;
};

/** Public navigation, in the order from Case 01 §4. */
export const NAV_ITEMS: readonly NavItem[] = [
  { labelKey: "home", href: "/", icon: HouseIcon },
  { labelKey: "about", href: "/about", icon: UserRoundIcon },
  { labelKey: "achievements", href: "/achievements", icon: AwardIcon },
  { labelKey: "projects", href: "/projects", icon: FolderGit2Icon },
  { labelKey: "dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { labelKey: "contact", href: "/contact", icon: MailIcon },
];

/** True when `pathname` is the item's page or one of its sub-pages (e.g. a project detail). */
export function isActiveNavItem(item: NavItem, pathname: string): boolean {
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
