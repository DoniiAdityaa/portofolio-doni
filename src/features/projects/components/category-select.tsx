"use client";

import { type Control, Controller } from "react-hook-form";

import { FormField } from "@/components/admin/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminCategory } from "@/lib/content/category-schema";

import type { ProjectFormValues } from "../schema";

/** Type or category picker for the project form. */
export function CategorySelect({
  id,
  label,
  control,
  name,
  options,
  error,
}: {
  id: string;
  label: string;
  control: Control<ProjectFormValues>;
  name: "typeId" | "categoryId";
  options: AdminCategory[];
  error?: string;
}) {
  return (
    <FormField id={id} label={label} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id={id}>
              <SelectValue placeholder={`Pick a ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FormField>
  );
}
