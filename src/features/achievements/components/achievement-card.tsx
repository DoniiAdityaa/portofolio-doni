import { ExternalLinkIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkillIcon } from "@/components/ui/skill-icon";
import { formatDate } from "@/lib/i18n/dates";
import { localize } from "@/lib/i18n/localize";

import type { AchievementWithRelations } from "../queries";
import { AchievementArtwork } from "./achievement-artwork";
import { AchievementLightbox } from "./achievement-lightbox";

/** Achievement card that opens the certificate viewer (Case 01 §5.3, CR-05). */
export async function AchievementCard({ item }: { item: AchievementWithRelations }) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("achievements")]);
  const title = localize(item.title, locale);
  const description = localize(item.description, locale);
  const issued = formatDate(item.issuedAt, locale, "month");

  const details = [
    description ? (
      <p key="description" className="text-sm text-muted-foreground">
        {description}
      </p>
    ) : null,
    <dl key="facts" className="grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-1">
      <Detail label={t("credentialId")} value={item.credentialId ?? "–"} mono />
      <Detail label={t("typeLabel")} value={t(`type.${item.type}`)} />
      {item.category ? (
        <Detail label={t("category")} value={localize(item.category.name, locale)} />
      ) : null}
      <Detail label={t("issued")} value={issued} />
      <Detail
        label={t("expires")}
        value={item.expiresAt ? formatDate(item.expiresAt, locale, "month") : t("noExpiry")}
      />
    </dl>,
    item.skills.length > 0 ? (
      <div key="skills" className="space-y-2">
        <p className="text-xs font-semibold tracking-wider text-amber uppercase">{t("skills")}</p>
        <ul className="flex flex-wrap gap-2">
          {item.skills.map((skill) => (
            <li key={skill.id}>
              <SkillIcon slug={skill.iconSlug} name={skill.name} />
            </li>
          ))}
        </ul>
      </div>
    ) : null,
    item.credentialUrl ? (
      <Button key="verify" asChild className="w-full">
        <a href={item.credentialUrl} target="_blank" rel="noreferrer">
          {t("verify")}
          <ExternalLinkIcon aria-hidden="true" />
        </a>
      </Button>
    ) : null,
  ].filter(Boolean);

  return (
    <AchievementLightbox
      title={title}
      issuer={item.issuer}
      image={
        <AchievementArtwork
          type={item.type}
          issuer={item.issuer}
          imagePath={item.imagePath}
          className="h-full w-full md:aspect-auto"
        />
      }
      details={details}
      trigger={
        <button
          type="button"
          aria-haspopup="dialog"
          className="group flex h-full w-full flex-col overflow-hidden rounded-xl border bg-card text-left transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-black/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <AchievementArtwork type={item.type} issuer={item.issuer} imagePath={item.imagePath} />
          <div className="flex flex-1 flex-col gap-2 p-4">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant={item.type === "award" ? "default" : "secondary"}>
                {t(`type.${item.type}`)}
              </Badge>
              {item.category ? (
                <Badge variant="outline">{localize(item.category.name, locale)}</Badge>
              ) : null}
            </div>
            <h2 className="font-heading text-base leading-snug font-medium transition-colors group-hover:text-primary">
              {title}
            </h2>
            <p className="mt-auto text-xs text-muted-foreground">
              {item.issuer} · {issued}
            </p>
          </div>
        </button>
      }
    />
  );
}

function Detail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className={mono ? "font-mono text-sm" : "text-sm"}>{value}</dd>
    </div>
  );
}
