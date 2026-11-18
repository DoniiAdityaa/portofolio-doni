import { DownloadIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

/**
 * Primary call to action (Case 01 §1).
 * Disabled until CV uploads exist (M4); M5 links it to the CV for the active language.
 */
export async function DownloadCvButton() {
  const t = await getTranslations("shell");

  return (
    <Button disabled className="w-full" size="lg" title={t("cvComingSoon")}>
      <DownloadIcon aria-hidden="true" />
      {t("downloadCv")}
    </Button>
  );
}
