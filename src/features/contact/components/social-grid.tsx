import { BriefcaseBusinessIcon, MailIcon } from "lucide-react";

import { PLATFORM_LABELS, socialHref } from "@/components/layout/social-icon";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { BrandIcon, findBrandIcon } from "@/components/ui/brand-icon";
import type { SocialLink } from "@/features/settings/types";

/** The address for email, or "@handle" from the last path part of a profile URL. */
function handleFor(link: SocialLink): string {
  if (link.platform === "email") return link.url;
  const lastPart = link.url.replace(/\/+$/, "").split("/").pop() ?? link.url;
  return lastPart.startsWith("@") ? lastPart : `@${lastPart}`;
}

/**
 * Email and social profiles as tiles (Case 01 §5.6). Icons start in grayscale and
 * switch to their color as the tile lifts on hover. Empty platforms are not passed in.
 */
export function SocialGrid({ links }: { links: SocialLink[] }) {
  if (links.length === 0) return null;

  return (
    <RevealGroup className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {links.map((link) => {
        const icon = findBrandIcon(link.platform);
        return (
          <RevealItem key={link.platform}>
            <a
              href={socialHref(link.platform, link.url)}
              target={link.platform === "email" ? undefined : "_blank"}
              rel="noreferrer"
              className="group flex h-full flex-col items-center gap-2 rounded-xl border bg-card px-3 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-black/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="grayscale transition-[filter,transform] duration-300 group-hover:scale-110 group-hover:grayscale-0">
                {link.platform === "email" ? (
                  <MailIcon aria-hidden="true" className="size-7 text-sky" />
                ) : icon ? (
                  <BrandIcon icon={icon} colored className="size-7" />
                ) : (
                  <BriefcaseBusinessIcon aria-hidden="true" className="size-7 text-sky" />
                )}
              </span>
              <span className="text-sm font-medium">{PLATFORM_LABELS[link.platform]}</span>
              <span className="w-full truncate font-mono text-xs text-muted-foreground">
                {handleFor(link)}
              </span>
            </a>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
