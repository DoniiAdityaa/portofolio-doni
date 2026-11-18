import { getLocale } from "next-intl/server";

import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/features/settings/queries";
import type { SiteSettings } from "@/features/settings/types";
import { localize } from "@/lib/i18n/localize";

import { DownloadCvButton } from "./download-cv-button";
import { LanguageToggle } from "./language-toggle";
import { NavMenu } from "./nav-menu";
import { ProfileAvatar } from "./profile-avatar";
import { RoleCard } from "./role-card";
import { SocialLinks } from "./social-links";
import { ThemeToggle } from "./theme-toggle";

/** Everything in the sidebar; shared by the desktop sidebar and the mobile drawer. */
export async function SidebarContent({ settings }: { settings: SiteSettings }) {
  const locale = await getLocale();
  const roles = settings.roles.map((role) => localize(role, locale)).filter(Boolean);

  return (
    <div className="flex h-full flex-col gap-6 p-5 md:px-0 md:py-2">
      <div className="flex flex-col items-center gap-3 text-center">
        <ProfileAvatar initials={getInitials(settings.name)} photoPath={settings.photoPath} />
        <p className="font-heading text-xl font-semibold">{settings.name}</p>
        <RoleCard roles={roles.length > 0 ? roles : [localize(settings.headline, locale)]} />
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      <Separator />
      <NavMenu />

      <div className="mt-auto space-y-4">
        <Separator />
        <DownloadCvButton className="w-full" />
        <SocialLinks links={settings.socialLinks} />
      </div>
    </div>
  );
}
