"use client";

import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  MailIcon,
  MailOpenIcon,
  ReplyIcon,
  Trash2Icon,
} from "lucide-react";

import { ConfirmButton } from "@/components/admin/confirm-button";
import { useAdminAction } from "@/components/admin/use-admin-action";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

import { archiveMessage, deleteMessage, restoreMessage, setMessageRead } from "../actions";
import type { InboxMessage, InboxView } from "../queries";

const DATE_FORMAT = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

/** Contact messages; opening one marks it as read (Case 03 M4 #10). */
export function MessageList({ messages, view }: { messages: InboxMessage[]; view: InboxView }) {
  const { run, pending } = useAdminAction();

  if (messages.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        {view === "inbox" ? "No messages yet." : "No archived messages."}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {messages.map((message) => (
        <li key={message.id}>
          <details
            className="group rounded-lg border bg-card open:ring-1 open:ring-primary/30"
            onToggle={(event) => {
              if (event.currentTarget.open && !message.isRead) {
                run(() => setMessageRead({ id: message.id, isRead: true }), null);
              }
            }}
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 p-3 [&::-webkit-details-marker]:hidden">
              <span
                aria-hidden="true"
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  message.isRead ? "bg-transparent" : "bg-primary",
                )}
              />
              <div className="min-w-0 flex-1">
                <p className={cn("truncate", !message.isRead && "font-semibold")}>
                  {message.name}{" "}
                  <span className="font-normal text-muted-foreground">&lt;{message.email}&gt;</span>
                </p>
                <p className="truncate text-sm text-muted-foreground">{message.message}</p>
              </div>
              <time dateTime={message.createdAt} className="shrink-0 text-xs text-muted-foreground">
                {DATE_FORMAT.format(new Date(message.createdAt))}
              </time>
              {message.isRead ? null : <span className="sr-only">Unread</span>}
            </summary>

            <div className="flex flex-col gap-4 border-t p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" asChild>
                  <a
                    href={`mailto:${message.email}?subject=${encodeURIComponent("Re: your message")}`}
                  >
                    <ReplyIcon aria-hidden="true" />
                    Reply by email
                  </a>
                </Button>

                {view === "inbox" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pending}
                      onClick={() =>
                        run(
                          () => setMessageRead({ id: message.id, isRead: !message.isRead }),
                          message.isRead ? "Marked as unread." : "Marked as read.",
                        )
                      }
                    >
                      {message.isRead ? (
                        <MailIcon aria-hidden="true" />
                      ) : (
                        <MailOpenIcon aria-hidden="true" />
                      )}
                      {message.isRead ? "Mark as unread" : "Mark as read"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pending}
                      onClick={() => run(() => archiveMessage({ id: message.id }), "Archived.")}
                    >
                      <ArchiveIcon aria-hidden="true" />
                      Archive
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pending}
                      onClick={() =>
                        run(() => restoreMessage({ id: message.id }), "Moved back to the inbox.")
                      }
                    >
                      <ArchiveRestoreIcon aria-hidden="true" />
                      Restore
                    </Button>
                    <ConfirmButton
                      title="Delete this message permanently?"
                      description="It cannot be recovered."
                      confirmLabel="Delete"
                      destructive
                      onConfirm={() => run(() => deleteMessage({ id: message.id }), "Deleted.")}
                      trigger={
                        <Button variant="ghost" size="sm" disabled={pending}>
                          <Trash2Icon aria-hidden="true" />
                          Delete
                        </Button>
                      }
                    />
                  </>
                )}
              </div>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
