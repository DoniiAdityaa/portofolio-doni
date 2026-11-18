"use client";

import { GitBranchIcon, Loader2Icon, RefreshCwIcon } from "lucide-react";

import { useAdminAction } from "@/components/admin/use-admin-action";
import { Button } from "@/components/ui/button";
import { refreshGithubNow } from "@/features/github/actions";

const DATE_FORMAT = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

/** Shows when the Dashboard's GitHub data was saved, with a "Refresh now" button. */
export function GithubRefreshCard({ fetchedAt }: { fetchedAt: string | null }) {
  const { run, pending } = useAdminAction();

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <GitBranchIcon aria-hidden="true" className="size-4" />
        GitHub data
      </span>
      <span className="text-sm">
        {fetchedAt ? `Updated ${DATE_FORMAT.format(new Date(fetchedAt))}` : "Not fetched yet"}
      </span>
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        disabled={pending}
        onClick={() => run(refreshGithubNow, "GitHub data refreshed.")}
      >
        {pending ? (
          <Loader2Icon aria-hidden="true" className="animate-spin" />
        ) : (
          <RefreshCwIcon aria-hidden="true" />
        )}
        Refresh now
      </Button>
      <p className="text-xs text-muted-foreground">Also refreshed automatically every day.</p>
    </div>
  );
}
