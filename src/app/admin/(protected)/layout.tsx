import { LogOutIcon, ShieldCheckIcon } from "lucide-react";
import { Suspense } from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { signOut } from "@/features/auth/actions";
import { requireAdminPage } from "@/lib/auth/admin";

/**
 * Every page under here requires an admin (Case 02 §8, layer 1 behind the proxy).
 * The session is read inside Suspense, so the shell streams in.
 */
export default function ProtectedAdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <Suspense fallback={<AdminShellSkeleton />}>
        <AdminGate>{children}</AdminGate>
      </Suspense>
      {/* Expanded, so several toasts list neatly instead of stacking on top of each other. */}
      <Toaster richColors expand position="top-right" visibleToasts={4} />
    </>
  );
}

async function AdminGate({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminPage();

  return (
    // Same centered frame as the public site (CR-01): sidebar and content share one container.
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 sm:px-6 md:flex-row md:gap-10 lg:gap-14">
      <aside className="flex flex-col gap-6 border-b py-6 md:sticky md:top-0 md:h-dvh md:w-56 md:shrink-0 md:border-b-0 md:py-8">
        <div className="flex items-center gap-2 px-3 font-heading font-semibold">
          <ShieldCheckIcon aria-hidden="true" className="size-5 text-primary" />
          Admin
        </div>
        <AdminNav />
        <div className="flex flex-col gap-2 px-3 md:mt-auto">
          <span className="truncate text-xs text-muted-foreground">{admin.email}</span>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm" className="w-full">
              <LogOutIcon aria-hidden="true" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 pb-12 md:py-12">{children}</main>
    </div>
  );
}

function AdminShellSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 sm:px-6 md:flex-row md:gap-10 lg:gap-14">
      <div className="flex flex-col gap-2 py-6 md:w-56 md:py-8">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="flex-1 md:py-12">
        <Skeleton className="h-24 w-full max-w-xl" />
      </div>
    </div>
  );
}
