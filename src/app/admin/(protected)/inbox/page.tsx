import type { Metadata } from "next";
import Link from "next/link";

import { MessageList } from "@/features/inbox/components/message-list";
import { getMessages, type InboxView } from "@/features/inbox/queries";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Inbox" };

const VIEWS: { view: InboxView; label: string; href: string }[] = [
  { view: "inbox", label: "Inbox", href: "/admin/inbox" },
  { view: "archived", label: "Archived", href: "/admin/inbox?view=archived" },
];

export default async function AdminInboxPage({ searchParams }: PageProps<"/admin/inbox">) {
  const { view: requested } = await searchParams;
  const view: InboxView = requested === "archived" ? "archived" : "inbox";
  const messages = await getMessages(view);

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Inbox</h1>
        <p className="text-muted-foreground">Messages sent through the Contact page.</p>
      </div>
      <nav aria-label="Inbox views" className="flex gap-1">
        {VIEWS.map((option) => (
          <Link
            key={option.view}
            href={option.href}
            aria-current={option.view === view ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
              option.view === view && "bg-primary/10 text-primary hover:text-primary",
            )}
          >
            {option.label}
          </Link>
        ))}
      </nav>
      <MessageList messages={messages} view={view} />
    </div>
  );
}
