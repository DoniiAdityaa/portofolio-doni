"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "@/components/admin/form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { lookupSkillIcon, saveSkill } from "../actions";
import type { AdminSkillCategory } from "../admin-queries";
import type { IconPreview } from "../icon-preview";
import { type SkillFormValues, skillFormSchema } from "../schema";
import { IconGlyph } from "./icon-glyph";

const PREVIEW_DELAY_MS = 350;

/** Add or edit a skill. The icon preview is looked up on the server as the slug is typed. */
export function SkillFormDialog({
  trigger,
  categories,
  initialValues,
  onSaved,
}: {
  trigger: ReactNode;
  categories: AdminSkillCategory[];
  initialValues: SkillFormValues;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: initialValues,
  });
  const slug = useWatch({ control, name: "iconSlug" });
  const name = useWatch({ control, name: "name" });
  // Search by the slug being typed, or by the skill name while the slug is still empty.
  const lookup = useIconLookup(open ? slug || name : "");
  const preview = lookup?.match?.slug === slug.trim().toLowerCase() ? lookup.match : null;
  const suggestions = (lookup?.suggestions ?? []).filter((icon) => icon.slug !== preview?.slug);

  async function onSubmit(values: SkillFormValues) {
    const result = await saveSkill(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(values.id ? "Skill updated." : "Skill added.");
    setOpen(false);
    onSaved();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) reset(initialValues);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialValues.id ? "Edit skill" : "Add skill"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField id="skill-name" label="Name" error={errors.name?.message}>
            <Input id="skill-name" autoComplete="off" {...register("name")} />
          </FormField>

          <FormField
            id="skill-icon"
            label="Icon slug"
            hint="Type a name or slug; matching icons appear as suggestions."
            error={errors.iconSlug?.message}
          >
            <div className="flex items-center gap-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-secondary">
                <IconGlyph icon={preview} />
              </span>
              <Input id="skill-icon" autoComplete="off" {...register("iconSlug")} />
            </div>
            {slug && !preview ? (
              <p className="text-xs text-muted-foreground">
                No icon has this slug. Pick a suggestion below.
              </p>
            ) : null}
            {suggestions.length > 0 ? (
              <div className="flex flex-wrap gap-1.5" aria-label="Icon suggestions">
                {suggestions.map((icon) => (
                  <button
                    key={icon.slug}
                    type="button"
                    onClick={() =>
                      setValue("iconSlug", icon.slug, { shouldDirty: true, shouldValidate: true })
                    }
                    className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <IconGlyph icon={icon} className="size-3.5" />
                    {icon.title}
                    <span className="font-mono opacity-70">{icon.slug}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </FormField>

          <FormField id="skill-category" label="Category" error={errors.categoryId?.message}>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="skill-category">
                    <SelectValue placeholder="Pick a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <label className="flex items-center gap-2 text-sm">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  checked={field.value === "published"}
                  onChange={(event) => field.onChange(event.target.checked ? "published" : "draft")}
                />
              )}
            />
            Published (visible on the site)
          </label>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2Icon aria-hidden="true" className="animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type IconLookup = { match: IconPreview | null; suggestions: IconPreview[] };

/** Debounced server lookup: the exact icon for a slug plus name suggestions. */
function useIconLookup(query: string): IconLookup | null {
  const [lookup, setLookup] = useState<{ query: string; result: IconLookup } | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      const result = await lookupSkillIcon({ query: trimmed });
      if (!cancelled && result.ok) setLookup({ query: trimmed, result: result.data });
    }, PREVIEW_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  return lookup?.query === query.trim() ? lookup.result : null;
}
