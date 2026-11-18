import { DownloadIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/features/settings/queries";
import { DOCUMENTS_BUCKET, publicFileUrl } from "@/lib/supabase/storage";

/**
 * Primary call to action (Case 01 §1): the CV in the visitor's language, falling back to
 * the other language. Disabled while no CV is uploaded.
 */
export async function DownloadCvButton({ className }: { className?: string }) {
  const [t, locale, { cvPaths }] = await Promise.all([
    getTranslations("shell"),
    getLocale(),
    getSiteSettings(),
  ]);
  const path = (locale === "id" ? cvPaths.id : cvPaths.en) ?? cvPaths.en ?? cvPaths.id;
  const url = path ? publicFileUrl(path, DOCUMENTS_BUCKET) : null;

  if (!url) {
    return (
      <Button disabled className={className} size="lg" title={t("cvComingSoon")}>
        <DownloadIcon aria-hidden="true" />
        {t("downloadCv")}
      </Button>
    );
  }

  return (
    <Button asChild className={className} size="lg">
      <a href={url} target="_blank" rel="noreferrer" download>
        <DownloadIcon aria-hidden="true" />
        {t("downloadCv")}
      </a>
    </Button>
  );
}
