import { ConstructionIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { EmptyState } from "@/components/ui/empty-state";

import { PageHeader } from "./page-header";

type ComingSoonPageProps = {
  page: "about" | "achievements" | "projects" | "dashboard" | "contact";
};

/** Temporary page body for routes whose content is built in M2. */
export async function ComingSoonPage({ page }: ComingSoonPageProps) {
  const tNav = await getTranslations("nav");
  const tPages = await getTranslations("pages");

  return (
    <div className="space-y-8">
      <PageHeader title={tNav(page)} description={tPages(`${page}.description`)} />
      <EmptyState
        icon={ConstructionIcon}
        title={tPages("comingSoonTitle")}
        description={tPages("comingSoonDescription")}
      />
    </div>
  );
}
