import { LogOutIcon } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut } from "@/features/auth/actions";
import { requireAdminPage } from "@/lib/auth/admin";

/**
 * Every page under here requires an admin (Case 02 §8, layer 1 behind the proxy).
 * The session is read inside Suspense, so the shell streams in.
 */
export default function ProtectedAdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<AdminShellSkeleton />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}

async function AdminGate({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminPage();

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between gap-4 border-b px-6 py-3">
        <span className="font-heading font-semibold">Admin</span>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">{admin.email}</span>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              <LogOutIcon aria-hidden="true" />
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

function AdminShellSkeleton() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b px-6 py-3">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="p-6">
        <Skeleton className="h-24 w-full max-w-xl" />
      </div>
    </div>
  );
}
