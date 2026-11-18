import type { Metadata } from "next";

export const metadata: Metadata = { title: "Overview" };

/** Placeholder until M4 builds the content modules and the overview counts. */
export default function AdminOverviewPage() {
  return (
    <div className="max-w-xl space-y-2">
      <h1 className="font-heading text-2xl font-semibold">Overview</h1>
      <p className="text-muted-foreground">
        You are signed in as the admin. Content management modules arrive in M4.
      </p>
    </div>
  );
}
