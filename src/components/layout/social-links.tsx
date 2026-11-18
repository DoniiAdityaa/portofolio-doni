import { getTranslations } from "next-intl/server";

import type { SocialLink } from "@/features/settings/types";

import { PLATFORM_LABELS, SocialIcon, socialHref } from "./social-icon";

/** Icon links to the owner's profiles. Empty platforms are simply not passed in. */
export async function SocialLinks({ links }: { links: SocialLink[] }) {
  if (links.length === 0) return null;

  const t = await getTranslations("shell");

  return (
    <ul aria-label={t("socialLinks")} className="flex flex-wrap justify-center gap-1">
      {links.map((link) => (
        <li key={link.platform}>
          <a
            href={socialHref(link.platform, link.url)}
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
