import { BriefcaseBusinessIcon, MailIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { BrandIcon, findBrandIcon } from "@/components/ui/brand-icon";
import type { SocialLink, SocialPlatform } from "@/features/settings/types";

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  x: "X",
  tiktok: "TikTok",
  email: "Email",
};

/** Icon links to the owner's profiles. Empty platforms are simply not passed in. */
export async function SocialLinks({ links }: { links: SocialLink[] }) {
  if (links.length === 0) return null;

  const t = await getTranslations("shell");

  return (
    <ul aria-label={t("socialLinks")} className="flex flex-wrap gap-1">
      {links.map((link) => (
        <li key={link.platform}>
          <a
            href={link.platform === "email" ? `mailto:${link.url}` : link.url}
            target={link.platform === "email" ? undefined : "_blank"}
            rel="noreferrer"
            aria-label={PLATFORM_LABELS[link.platform]}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <SocialIcon platform={link.platform} />
          </a>
        </li>
      ))}
    </ul>
  );
}

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "email") return <MailIcon aria-hidden="true" className="size-4" />;

  const icon = findBrandIcon(platform);
  // LinkedIn is not in Simple Icons (removed at the brand's request).
  if (!icon) return <BriefcaseBusinessIcon aria-hidden="true" className="size-4" />;

  return <BrandIcon icon={icon} className="size-4" />;
}
