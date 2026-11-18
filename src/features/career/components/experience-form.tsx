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
import { type SkillOption, SkillPicker } from "@/components/admin/skill-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { saveExperience } from "../actions";
import {
  EXPERIENCE_TYPE_LABELS,
  EXPERIENCE_TYPES,
  type ExperienceFormValues,
  experienceFormSchema,
} from "../schema";

const LIST_HINT = "One item per line.";
const BACK_HREF = "/admin/career";

/** Add or edit a career entry (Case 03 M4 #6). */
export function ExperienceForm({
  defaultValues,
  skillOptions,
}: {
  defaultValues: ExperienceFormValues;
  skillOptions: SkillOption[];
}) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues,
  });

  async function onSubmit(values: ExperienceFormValues) {
    const result = await saveExperience(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(values.id ? "Experience updated." : "Experience added.");
    router.push(BACK_HREF);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-3xl flex-col gap-6">
      <FormSection title="Role">
        <FormField id="company" label="Company" error={errors.company?.message}>
          <Input id="company" autoComplete="off" {...register("company")} />
        </FormField>
        <Controller
          control={control}
          name="logoPath"
          render={({ field }) => (
            <ImageUpload
              label="Company logo"
              folder="career/logos"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <BilingualField
          label="Position"
          register={(locale) => register(`position.${locale}`)}
          errors={{ en: errors.position?.en?.message, id: errors.position?.id?.message }}
        />
        <FormField id="type" label="Type" error={errors.type?.message}>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="type" className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {EXPERIENCE_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="startDate" label="Start date" error={errors.startDate?.message}>
            <Input id="startDate" type="date" {...register("startDate")} />
          </FormField>
          <FormField
            id="endDate"
            label="End date"
            hint="Leave empty while you still work here (Present)."
            error={errors.endDate?.message}
          >
            <Input id="endDate" type="date" {...register("endDate")} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Details" description="Shown when a visitor expands the card on About.">
        <BilingualField
          label="Responsibilities"
          hint={LIST_HINT}
          multiline
          rows={5}
          register={(locale) => register(`responsibilities.${locale}`)}
          errors={{
            en: errors.responsibilities?.en?.message,
            id: errors.responsibilities?.id?.message,
          }}
        />
        <BilingualField
          label="What I learned"
          hint={LIST_HINT}
          multiline
          rows={4}
          register={(locale) => register(`learnings.${locale}`)}
          errors={{ en: errors.learnings?.en?.message, id: errors.learnings?.id?.message }}
        />
        <BilingualField
          label="Impact"
          hint={LIST_HINT}
          multiline
          rows={4}
          register={(locale) => register(`impact.${locale}`)}
          errors={{ en: errors.impact?.en?.message, id: errors.impact?.id?.message }}
        />
        <Controller
          control={control}
          name="skillIds"
          render={({ field }) => (
            <SkillPicker
              label="Tech used"
              options={skillOptions}
              value={field.value}
              onChange={field.onChange}
            />
          )}
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
