"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { BilingualField } from "@/components/admin/bilingual-field";
import { FormActions } from "@/components/admin/form-actions";
import { FormField } from "@/components/admin/form-field";
import { FormSection } from "@/components/admin/form-section";
import { ImageUpload } from "@/components/admin/image-upload";
import { Input } from "@/components/ui/input";

import { saveEducation } from "../actions";
import { type EducationFormValues, educationFormSchema } from "../schema";

const BACK_HREF = "/admin/education";

/** Add or edit an education entry (Case 03 M4 #6). */
export function EducationForm({ defaultValues }: { defaultValues: EducationFormValues }) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues,
  });

  async function onSubmit(values: EducationFormValues) {
    const result = await saveEducation(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(values.id ? "Education updated." : "Education added.");
    router.push(BACK_HREF);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-3xl flex-col gap-6">
      <FormSection title="School">
        <FormField id="institution" label="Institution" error={errors.institution?.message}>
          <Input id="institution" autoComplete="off" {...register("institution")} />
        </FormField>
        <Controller
          control={control}
          name="logoPath"
          render={({ field }) => (
            <ImageUpload
              label="Logo"
              folder="education/logos"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <BilingualField
          label="Degree or program"
          register={(locale) => register(`degree.${locale}`)}
          errors={{ en: errors.degree?.en?.message, id: errors.degree?.id?.message }}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="startDate" label="Start date" error={errors.startDate?.message}>
            <Input id="startDate" type="date" {...register("startDate")} />
          </FormField>
          <FormField
            id="endDate"
            label="End date"
            hint="Leave empty while you are still studying."
            error={errors.endDate?.message}
          >
            <Input id="endDate" type="date" {...register("endDate")} />
          </FormField>
        </div>
        <BilingualField
          label="Notes"
          hint="Optional: GPA, focus, or activities."
          multiline
          rows={3}
          register={(locale) => register(`notes.${locale}`)}
          errors={{ en: errors.notes?.en?.message, id: errors.notes?.id?.message }}
        />
      </FormSection>

      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <FormActions
            status={field.value}
            onStatusChange={field.onChange}
            cancelHref={BACK_HREF}
            submitting={isSubmitting}
          />
        )}
      />
    </form>
  );
}
