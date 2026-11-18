import "server-only";

import type { z } from "zod";

import { NotAdminError, requireAdmin } from "@/lib/auth/admin";

import { type ActionResult, fail } from "./result";

/**
 * The admin server action pattern (Case 03 M4): validate with Zod → require an admin →
 * run the write. Expected failures become `{ ok: false }`; unexpected ones are logged and
 * shown as a generic message, so database details never reach the browser.
 */
export async function runAdminAction<TSchema extends z.ZodType, TResult>(
  schema: TSchema,
  input: unknown,
  write: (data: z.infer<TSchema>) => Promise<ActionResult<TResult>>,
): Promise<ActionResult<TResult>> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the form.");

  try {
    await requireAdmin();
    return await write(parsed.data);
  } catch (error) {
    if (error instanceof NotAdminError) return fail("Your session has ended. Sign in again.");
    console.error("[admin] Action failed", error);
    return fail("Something went wrong. Try again.");
  }
}
