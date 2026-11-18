import { InboxIcon, Trash2Icon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { GithubRefreshCard } from "@/features/overview/components/github-refresh-card";
import { VisitorChart } from "@/features/overview/components/visitor-chart";
import { getOverviewCounts } from "@/features/overview/queries";
import { getGithubFetchedAt, getVisitorStats } from "@/features/overview/visitor-stats";
import type { ContentTable } from "@/lib/actions/content-rows";

export const metadata: Metadata = { title: "Overview" };

const CONTENT_LINKS: Record<ContentTable, { label: string; href: string }> = {
  projects: { label: "Projects", href: "/admin/projects" },
  experiences: { label: "Career", href: "/admin/career" },
  educations: { label: "Education", href: "/admin/education" },
  achievements: { label: "Achievements", href: "/admin/achievements" },
  skills: { label: "Skills", href: "/admin/skills" },
};

/** Admin home: visitors, content counts, unread messages, trash, and GitHub data. */
export default async function AdminOverviewPage() {
  const [{ content, unreadMessages, trash }, visitorStats, githubFetchedAt] = await Promise.all([
    getOverviewCounts(),
    getVisitorStats(),
    getGithubFetchedAt(),
  ]);

  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Overview</h1>
        <p className="text-muted-foreground">What is on your site right now.</p>
      </div>

      <VisitorChart stats={visitorStats} />

      <section aria-label="Content" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {content.map(({ table, published, draft }) => (
          <StatCard
            key={table}
            href={CONTENT_LINKS[table].href}
            label={CONTENT_LINKS[table].label}
            value={published}
            detail={draft > 0 ? `${draft} draft${draft === 1 ? "" : "s"}` : "All published"}
          />
        ))}
      </section>

      <section aria-label="Activity" className="grid gap-3 sm:grid-cols-3">
        <StatCard
          href="/admin/inbox"
          label="Unread messages"
          value={unreadMessages}
          icon={<InboxIcon aria-hidden="true" className="size-4" />}
        />
        <StatCard
          href="/admin/trash"
          label="In trash"
          value={trash}
          icon={<Trash2Icon aria-hidden="true" className="size-4" />}
        />
        <GithubRefreshCard fetchedAt={githubFetchedAt} />
      </section>
    </div>
  );
}

function StatCard({
  href,
  label,
  value,
  detail,
  icon,
}: {
  href: string;
  label: string;
  value: number;
  detail?: string;
  icon?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-heading text-3xl font-semibold tabular-nums">{value}</span>
      {detail ? <span className="text-xs text-muted-foreground">{detail}</span> : null}
    </Link>
  );
}
