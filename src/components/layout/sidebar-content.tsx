import { getTranslations } from "next-intl/server";

import { Separator } from "@/components/ui/separator";
import type { ProfileSummary } from "@/features/settings/placeholder-profile";

import { DownloadCvButton } from "./download-cv-button";
import { LanguageToggle } from "./language-toggle";
import { NavMenu } from "./nav-menu";
import { SocialLinks } from "./social-links";

/** Everything in the sidebar; shared by the desktop sidebar and the mobile drawer. */
export async function SidebarContent({ profile }: { profile: ProfileSummary }) {
  const t = await getTranslations("profile");

  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <div className="flex flex-col items-center gap-3 pt-2 text-center">
        {/* Photo placeholder until Site Settings provide the real photo (M4/M5). */}
        <div
          aria-hidden="true"
          className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-sky/30 to-teal/30 font-heading text-2xl font-semibold ring-2 ring-border"
        >
          {profile.initials}
        </div>
        <div>
          <p className="font-heading text-lg font-semibold">{profile.name}</p>
          <p className="text-sm text-muted-foreground">{t("role")}</p>
        </div>
        <LanguageToggle />
      </div>

      <Separator />
      <NavMenu />

      <div className="mt-auto space-y-4">
        <DownloadCvButton />
        <div className="flex justify-center">
          <SocialLinks links={profile.socialLinks} />
        </div>
      </div>
    </div>
  );
}
