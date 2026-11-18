"use client";

import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/actions/result";
import type { AdminCategory, CategoryFormValues } from "@/lib/content/category-schema";

import { CategoryFormDialog } from "./category-form-dialog";
import { ConfirmButton } from "./confirm-button";
import { SortableList } from "./sortable-list";
import { useAdminAction } from "./use-admin-action";

export type CategoryActions = {
  save: (values: CategoryFormValues) => Promise<ActionResult>;
  remove: (input: { id: string }) => Promise<ActionResult>;
  reorder: (input: { ids: string[] }) => Promise<ActionResult>;
};

/** Add, rename, reorder, and delete the categories of one module (Case 03 M4). */
export function CategoryManager({
  title,
  description,
  singular,
  categories,
  actions,
}: {
  title: string;
  description: string;
  /** e.g. "category" or "type", used in button labels. */
  singular: string;
  categories: AdminCategory[];
  actions: CategoryActions;
}) {
  const router = useRouter();
  const { run } = useAdminAction();
  const refresh = () => router.refresh();

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <CategoryFormDialog
          initialValues={{ name: { en: "", id: "" } }}
          save={actions.save}
          onSaved={refresh}
          trigger={
            <Button variant="outline" size="sm">
              <PlusIcon aria-hidden="true" />
              Add {singular}
            </Button>
          }
        />
      </div>

      {categories.length === 0 ? (
        <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          No {singular} yet.
        </p>
      ) : (
        <SortableList
          label={title}
          items={categories}
          onReorder={(ids) => run(() => actions.reorder({ ids }), "Order saved.")}
          renderItem={(category) => (
            <>
              <span className="min-w-0 flex-1 truncate font-medium">
                {category.name.en}
                {category.name.id && category.name.id !== category.name.en ? (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {category.name.id}
                  </span>
                ) : null}
              </span>
              <CategoryFormDialog
                initialValues={category}
                save={actions.save}
                onSaved={refresh}
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Rename ${category.name.en}`}
                    title="Rename"
                  >
                    <PencilIcon aria-hidden="true" />
                  </Button>
                }
              />
              <ConfirmButton
                title={`Delete "${category.name.en}"?`}
                description={`Only an unused ${singular} can be deleted. This cannot be undone.`}
                confirmLabel="Delete"
                destructive
                onConfirm={() => run(() => actions.remove({ id: category.id }), "Deleted.")}
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${category.name.en}`}
                    title="Delete"
                  >
                    <Trash2Icon aria-hidden="true" />
                  </Button>
                }
              />
            </>
          )}
        />
      )}
    </section>
  );
}
