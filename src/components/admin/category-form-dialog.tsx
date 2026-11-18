"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { BilingualField } from "@/components/admin/bilingual-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ActionResult } from "@/lib/actions/result";
import { type CategoryFormValues, categoryFormSchema } from "@/lib/content/category-schema";

/** Add or rename a category; `save` is the module's server action. */
export function CategoryFormDialog({
  trigger,
  initialValues,
  save,
  onSaved,
}: {
  trigger: ReactNode;
  initialValues: CategoryFormValues;
  save: (values: CategoryFormValues) => Promise<ActionResult>;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: CategoryFormValues) {
    const result = await save(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(values.id ? "Category renamed." : "Category added.");
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
          <DialogTitle>{initialValues.id ? "Rename category" : "Add category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <BilingualField
            label="Name"
            register={(locale) => register(`name.${locale}`)}
            errors={{ en: errors.name?.en?.message, id: errors.name?.id?.message }}
          />
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
