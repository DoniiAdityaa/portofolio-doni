import { BriefcaseBusinessIcon, MailIcon } from "lucide-react";

import { BrandIcon, findBrandIcon } from "@/components/ui/brand-icon";
import type { SocialPlatform } from "@/features/settings/types";
import { cn } from "@/lib/utils/cn";

export const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  x: "X",
  tiktok: "TikTok",
  email: "Email",
};

/** Icon for a social platform; LinkedIn is not in Simple Icons, so it uses a fallback. */
export function SocialIcon({
  platform,
  className,
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  const classes = cn("size-4", className);
  if (platform === "email") return <MailIcon aria-hidden="true" className={classes} />;

  const icon = findBrandIcon(platform);
  if (!icon) return <BriefcaseBusinessIcon aria-hidden="true" className={classes} />;

  return <BrandIcon icon={icon} className={classes} />;
}

/** Link target for a social entry: `mailto:` for email, the URL otherwise. */
export function socialHref(platform: SocialPlatform, url: string): string {
  return platform === "email" ? `mailto:${url}` : url;
}
