"use client";

import { TriangleAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

type ErrorPageProps = {
  error: unknown;
  /** Re-fetches and re-renders the failed segment. */
  retry: () => void;
};

export default function ErrorPage({ retry }: ErrorPageProps) {
  const t = useTranslations("error");

  return (
    <EmptyState
      icon={TriangleAlertIcon}
      title={t("title")}
      description={t("description")}
      className="mt-12"
      action={
        <Button variant="outline" onClick={() => retry()}>
          {t("retry")}
        </Button>
      }
    />
  );
}
