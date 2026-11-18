import "server-only";

import { z } from "zod";

import type { AdminCategory, CategoryFormValues } from "@/lib/content/category-schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { CategoryTable } from "./content-rows";

/** Postgres: a row is still referenced by a foreign key. */
const FOREIGN_KEY_VIOLATION = "23503";

// Every category table has the same columns; they are written through one table type.
type Writable = "skill_categories";

const storedText = z.object({ en: z.string(), id: z.string() }).catch({ en: "", id: "" });

export async function getCategories(table: CategoryTable): Promise<AdminCategory[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(table as Writable)
    .select("id, name")
    .order("sort_order");
  if (error) throw error;
  return data.map((row) => ({ id: row.id, name: storedText.parse(row.name) }));
}

/** Renames a category, or adds a new one at the end of the list. */
export async function saveCategoryRow(table: CategoryTable, { id, name }: CategoryFormValues) {
  const supabase = await createSupabaseServerClient();

  if (id) {
    const { error } = await supabase
      .from(table as Writable)
      .update({ name })
      .eq("id", id);
    if (error) throw error;
    return;
  }

  const { count, error: countError } = await supabase
    .from(table as Writable)
    .select("id", { count: "exact", head: true });
  if (countError) throw countError;
  const { error } = await supabase
    .from(table as Writable)
    .insert({ name, sort_order: (count ?? 0) + 1 });
  if (error) throw error;
}

/** Deletes a category. Returns `false` when content (including Trash) still uses it. */
export async function deleteCategoryRow(table: CategoryTable, id: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(table as Writable)
    .delete()
    .eq("id", id);
  if (error?.code === FOREIGN_KEY_VIOLATION) return false;
  if (error) throw error;
  return true;
}
