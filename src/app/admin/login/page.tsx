import { ShieldCheckIcon } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { LoginForm } from "@/features/auth/components/login-form";
import { getAdminUser } from "@/lib/auth/admin";
import { safeAdminRedirect } from "@/lib/auth/paths";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <ShieldCheckIcon aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h1 className="font-heading text-xl font-semibold">Admin sign in</h1>
            <p className="text-sm text-muted-foreground">Owner access only.</p>
          </div>
        </div>

        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginGate searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

/** Admins who are already signed in skip the form. */
async function LoginGate({ searchParams }: Pick<PageProps<"/admin/login">, "searchParams">) {
  const { next } = await searchParams;
  const target = safeAdminRedirect(next);

  if (await getAdminUser()) redirect(target);

  return <LoginForm next={target} />;
}

function LoginFormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-15" />
      <Skeleton className="h-15" />
      <Skeleton className="h-9" />
    </div>
  );
}
