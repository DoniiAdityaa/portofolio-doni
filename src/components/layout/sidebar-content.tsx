import { getLocale } from "next-intl/server";

import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/features/settings/queries";
import type { SiteSettings } from "@/features/settings/types";
import { localize } from "@/lib/i18n/localize";

import { DownloadCvButton } from "./download-cv-button";
import { LanguageToggle } from "./language-toggle";
import { NavMenu } from "./nav-menu";
import { ProfileAvatar } from "./profile-avatar";
import { SocialLinks } from "./social-links";

/** Everything in the sidebar; shared by the desktop sidebar and the mobile drawer. */
export async function SidebarContent({ settings }: { settings: SiteSettings }) {
  const locale = await getLocale();

  return (
    <div className="flex h-full flex-col gap-6 p-5 md:px-0 md:py-2">
      <div className="flex flex-col items-center gap-3 text-center">
        <ProfileAvatar initials={getInitials(settings.name)} />
        <div>
          <p className="font-heading text-xl font-semibold">{settings.name}</p>
          <p className="text-sm text-muted-foreground">{localize(settings.headline, locale)}</p>
        </div>
        <LanguageToggle />
      </div>

      <Separator />
      <NavMenu />

      <div className="mt-auto space-y-4">
        <Separator />
        <DownloadCvButton className="w-full" />
        <div className="flex justify-center">
          <SocialLinks links={settings.socialLinks} />
        </div>
      </div>
    </div>
  );
}
