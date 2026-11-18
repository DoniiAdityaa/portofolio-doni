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
import type { AdminCategory } from "@/lib/content/category-schema";

import { saveAchievement } from "../actions";
import {
  ACHIEVEMENT_TYPE_LABELS,
  ACHIEVEMENT_TYPES,
  type AchievementFormValues,
  achievementFormSchema,
} from "../schema";

const BACK_HREF = "/admin/achievements";
/** Radix Select cannot use an empty value, so "no category" has its own token. */
const NO_CATEGORY_VALUE = "none";

/** Add or edit a certificate or award (Case 03 M4 #7). */
export function AchievementForm({
  defaultValues,
  categories,
  skillOptions,
}: {
  defaultValues: AchievementFormValues;
  categories: AdminCategory[];
  skillOptions: SkillOption[];
}) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementFormSchema),
    defaultValues,
  });

  async function onSubmit(values: AchievementFormValues) {
    const result = await saveAchievement(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(values.id ? "Achievement updated." : "Achievement added.");
    router.push(BACK_HREF);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-3xl flex-col gap-6">
      <FormSection title="Achievement">
        <BilingualField
          label="Title"
          register={(locale) => register(`title.${locale}`)}
          errors={{ en: errors.title?.en?.message, id: errors.title?.id?.message }}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="type" label="Type">
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACHIEVEMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {ACHIEVEMENT_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
          <FormField id="category" label="Category">
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  value={field.value || NO_CATEGORY_VALUE}
                  onValueChange={(value) =>
                    field.onChange(value === NO_CATEGORY_VALUE ? "" : value)
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_CATEGORY_VALUE}>No category</SelectItem>
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
        </div>
        <FormField id="issuer" label="Issuer" error={errors.issuer?.message}>
          <Input id="issuer" autoComplete="off" {...register("issuer")} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="issuedAt" label="Issued on" error={errors.issuedAt?.message}>
            <Input id="issuedAt" type="date" {...register("issuedAt")} />
          </FormField>
          <FormField
            id="expiresAt"
            label="Expires on"
            hint="Leave empty if it does not expire."
            error={errors.expiresAt?.message}
          >
            <Input id="expiresAt" type="date" {...register("expiresAt")} />
          </FormField>
        </div>
        <Controller
          control={control}
          name="imagePath"
          render={({ field }) => (
            <ImageUpload
              label="Certificate image"
              folder="achievements"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </FormSection>

      <FormSection title="Credential" description="Lets visitors verify the certificate.">
        <FormField id="credentialUrl" label="Credential URL" error={errors.credentialUrl?.message}>
          <Input
            id="credentialUrl"
            type="url"
            placeholder="https://…"
            {...register("credentialUrl")}
          />
        </FormField>
        <FormField id="credentialId" label="Credential ID" error={errors.credentialId?.message}>
          <Input id="credentialId" autoComplete="off" {...register("credentialId")} />
        </FormField>
      </FormSection>

      <FormSection title="Details">
        <BilingualField
          label="Description"
          multiline
          rows={4}
          register={(locale) => register(`description.${locale}`)}
          errors={{ en: errors.description?.en?.message, id: errors.description?.id?.message }}
        />
        <Controller
          control={control}
          name="skillIds"
          render={({ field }) => (
            <SkillPicker
              label="Related skills"
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
