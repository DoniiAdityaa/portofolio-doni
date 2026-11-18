"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import type { ActionResult } from "@/lib/actions/result";

/**
 * Runs an admin server action with the same feedback everywhere: a toast for the result,
 * then a refresh so server-rendered lists show the change.
 */
export function useAdminAction() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run<T>(
    action: () => Promise<ActionResult<T>>,
    /** `null` for quiet actions, e.g. marking a message read on open. */
    successMessage: string | null,
    onSuccess?: (data: T) => void,
  ) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error);
        router.refresh();
        return;
      }
      if (successMessage) toast.success(successMessage);
      onSuccess?.(result.data);
      router.refresh();
    });
  }

  return { run, pending };
}
