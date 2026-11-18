"use client";

import { ArchiveIcon, EyeIcon, EyeOffIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { SortableList } from "@/components/admin/sortable-list";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminAction } from "@/components/admin/use-admin-action";
import { Button } from "@/components/ui/button";

import {
  archiveSkill,
  deleteSkillCategory,
  reorderSkillCategories,
  reorderSkills,
  saveSkillCategory,
  setSkillStatus,
} from "../actions";
import type { AdminSkill, AdminSkillCategory } from "../admin-queries";
import { IconGlyph } from "./icon-glyph";
import { SkillFormDialog } from "./skill-form-dialog";

/** Skills grouped by category, plus category management (Case 03 M4 #5). */
export function SkillsManager({
  categories,
  skills,
}: {
  categories: AdminSkillCategory[];
  skills: AdminSkill[];
}) {
  const router = useRouter();
  const { run } = useAdminAction();
  const refresh = () => router.refresh();
  const firstCategoryId = categories[0]?.id ?? "";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
        <SkillFormDialog
          categories={categories}
          initialValues={{ name: "", iconSlug: "", categoryId: firstCategoryId, status: "draft" }}
          onSaved={refresh}
          trigger={
            <Button disabled={categories.length === 0}>
              <PlusIcon aria-hidden="true" />
              Add skill
            </Button>
          }
        />
      </div>

      {categories.map((category) => {
        const categorySkills = skills.filter((skill) => skill.categoryId === category.id);

        return (
          <section key={category.id} className="flex flex-col gap-3">
            <h2 className="font-heading text-lg font-semibold">
              {category.name.en}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                ({categorySkills.length})
              </span>
            </h2>
            {categorySkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No skills in this category yet.</p>
            ) : (
              <SortableList
                label={`${category.name.en} skills`}
                items={categorySkills}
                onReorder={(ids) => run(() => reorderSkills({ ids }), "Order saved.")}
                renderItem={(skill) => (
                  <>
                    <IconGlyph icon={skill.icon} />
                    <span className="min-w-0 flex-1 truncate font-medium">{skill.name}</span>
                    <StatusBadge status={skill.status} />
                    <SkillActions skill={skill} categories={categories} onSaved={refresh} />
                  </>
                )}
              />
            )}
          </section>
        );
      })}

      <section className="flex flex-col gap-3 border-t pt-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold">Categories</h2>
            <p className="text-sm text-muted-foreground">
              Drag to change the order of the groups on Home.
            </p>
          </div>
          <CategoryFormDialog
            initialValues={{ name: { en: "", id: "" } }}
            save={saveSkillCategory}
            onSaved={refresh}
            trigger={
              <Button variant="outline" size="sm">
                <PlusIcon aria-hidden="true" />
                Add category
              </Button>
            }
          />
        </div>
        <SortableList
          label="Skill categories"
          items={categories}
          onReorder={(ids) => run(() => reorderSkillCategories({ ids }), "Order saved.")}
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
                save={saveSkillCategory}
                onSaved={refresh}
                trigger={
                  <IconButton label={`Rename ${category.name.en}`}>
                    <PencilIcon aria-hidden="true" />
                  </IconButton>
                }
              />
              <ConfirmButton
                title={`Delete "${category.name.en}"?`}
                description="Only empty categories can be deleted. This cannot be undone."
                confirmLabel="Delete"
                destructive
                onConfirm={() =>
                  run(() => deleteSkillCategory({ id: category.id }), "Category deleted.")
                }
                trigger={
                  <IconButton label={`Delete ${category.name.en}`}>
                    <Trash2Icon aria-hidden="true" />
                  </IconButton>
                }
              />
            </>
          )}
        />
      </section>
    </div>
  );
}

function SkillActions({
  skill,
  categories,
  onSaved,
}: {
  skill: AdminSkill;
  categories: AdminSkillCategory[];
  onSaved: () => void;
}) {
  const { run, pending } = useAdminAction();
  const published = skill.status === "published";

  return (
    <div className="flex items-center gap-0.5">
      <IconButton
        label={published ? `Unpublish ${skill.name}` : `Publish ${skill.name}`}
        disabled={pending}
        onClick={() =>
          run(
            () => setSkillStatus({ id: skill.id, status: published ? "draft" : "published" }),
            published ? "Moved to draft." : "Published.",
          )
        }
      >
        {published ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
      </IconButton>
      <SkillFormDialog
        categories={categories}
        initialValues={{
          id: skill.id,
          name: skill.name,
          iconSlug: skill.iconSlug,
          categoryId: skill.categoryId,
          status: skill.status,
        }}
        onSaved={onSaved}
        trigger={
          <IconButton label={`Edit ${skill.name}`}>
            <PencilIcon aria-hidden="true" />
          </IconButton>
        }
      />
      <ConfirmButton
        title={`Archive "${skill.name}"?`}
        description="It disappears from the site and moves to Trash, where you can restore it."
        confirmLabel="Archive"
        onConfirm={() => run(() => archiveSkill({ id: skill.id }), "Moved to Trash.")}
        trigger={
          <IconButton label={`Archive ${skill.name}`} disabled={pending}>
            <ArchiveIcon aria-hidden="true" />
          </IconButton>
        }
      />
    </div>
  );
}

function IconButton({
  label,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Button type="button" variant="ghost" size="icon" aria-label={label} title={label} {...props}>
      {children}
    </Button>
  );
}
