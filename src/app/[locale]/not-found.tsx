import { CompassIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Link } from "@/lib/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <EmptyState
      icon={CompassIcon}
      title={t("title")}
      description={t("description")}
      className="mt-12"
      action={
        <Button asChild variant="outline">
          <Link href="/">{t("backHome")}</Link>
        </Button>
      }
    />
  );
}
