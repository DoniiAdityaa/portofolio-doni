import { getTranslations } from "next-intl/server";

import { Separator } from "@/components/ui/separator";
import type { ProfileSummary } from "@/features/settings/placeholder-profile";

import { DownloadCvButton } from "./download-cv-button";
import { LanguageToggle } from "./language-toggle";
import { NavMenu } from "./nav-menu";
import { ProfileAvatar } from "./profile-avatar";
import { SocialLinks } from "./social-links";

/** Everything in the sidebar; shared by the desktop sidebar and the mobile drawer. */
export async function SidebarContent({ profile }: { profile: ProfileSummary }) {
  const t = await getTranslations("profile");

  return (
    <div className="flex h-full flex-col gap-6 p-5 md:px-0 md:py-2">
      <div className="flex flex-col items-center gap-3 text-center">
        <ProfileAvatar initials={profile.initials} />
        <div>
          <p className="font-heading text-xl font-semibold">{profile.name}</p>
          <p className="text-sm text-muted-foreground">{t("role")}</p>
        </div>
        <LanguageToggle />
      </div>

      <Separator />
      <NavMenu />

      <div className="mt-auto space-y-4">
        <Separator />
        <DownloadCvButton />
        <div className="flex justify-center">
          <SocialLinks links={profile.socialLinks} />
        </div>
      </div>
    </div>
  );
}
