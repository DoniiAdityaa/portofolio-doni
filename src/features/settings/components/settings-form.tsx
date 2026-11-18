"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { BilingualField } from "@/components/admin/bilingual-field";
import { FormField } from "@/components/admin/form-field";
import { FormSection } from "@/components/admin/form-section";
import { ImageUpload } from "@/components/admin/image-upload";
import { AddButton, RemoveButton } from "@/components/admin/list-buttons";
import { PLATFORM_LABELS } from "@/components/layout/social-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { updateSiteSettings } from "../actions";
import {
  MAX_ROLES,
  MAX_SOCIAL_LINKS,
  SOCIAL_PLATFORMS,
  type SiteSettingsFormValues,
  siteSettingsFormSchema,
} from "../schema";

/** Site Settings and Profile (Case 03 M4 #4). */
export function SettingsForm({ defaultValues }: { defaultValues: SiteSettingsFormValues }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsFormSchema),
    defaultValues,
  });
  const roles = useFieldArray({ control, name: "roles" });
  const socialLinks = useFieldArray({ control, name: "socialLinks" });

  async function onSubmit(values: SiteSettingsFormValues) {
    const result = await updateSiteSettings(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    reset(values);
    toast.success("Settings saved.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-3xl flex-col gap-6">
      <FormSection title="Profile" description="Shown in the sidebar and on Home and About.">
        <FormField id="name" label="Name" error={errors.name?.message}>
          <Input id="name" autoComplete="off" {...register("name")} />
        </FormField>
        <Controller
          control={control}
          name="photoPath"
          render={({ field }) => (
            <ImageUpload
              label="Profile photo"
              aspect={1}
              round
              folder="profile"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <BilingualField
          label="Headline"
          hint="Typed on Home, e.g. Mobile Developer (Flutter)."
          register={(locale) => register(`headline.${locale}`)}
          errors={{ en: errors.headline?.en?.message, id: errors.headline?.id?.message }}
        />
        <BilingualField
          label="Short intro"
          hint="One or two sentences on Home."
          multiline
          rows={3}
          register={(locale) => register(`shortIntro.${locale}`)}
          errors={{ en: errors.shortIntro?.en?.message, id: errors.shortIntro?.id?.message }}
        />
        <BilingualField
          label="Full intro"
          hint="The About page story. Separate paragraphs with a blank line."
          multiline
          rows={8}
          register={(locale) => register(`fullIntro.${locale}`)}
          errors={{ en: errors.fullIntro?.en?.message, id: errors.fullIntro?.id?.message }}
        />
      </FormSection>

      <FormSection
        title="Rotating roles"
        description="Shown one by one under your name in the sidebar."
      >
        {roles.fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2">
            <div className="flex-1">
              <BilingualField
                label={`Role ${index + 1}`}
                register={(locale) => register(`roles.${index}.text.${locale}`)}
                errors={{
                  en: errors.roles?.[index]?.text?.en?.message,
                  id: errors.roles?.[index]?.text?.id?.message,
                }}
              />
            </div>
            <RemoveButton label={`Remove role ${index + 1}`} onClick={() => roles.remove(index)} />
          </div>
        ))}
        <AddButton
          disabled={roles.fields.length >= MAX_ROLES}
          onClick={() => roles.append({ text: { en: "", id: "" } })}
        >
          Add role
        </AddButton>
      </FormSection>

      <FormSection
        title="Links"
        description="GitHub powers the Dashboard; social links appear everywhere."
      >
        <FormField
          id="githubUsername"
          label="GitHub username"
          error={errors.githubUsername?.message}
        >
          <Input id="githubUsername" autoComplete="off" {...register("githubUsername")} />
        </FormField>

        {socialLinks.fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <Controller
              control={control}
              name={`socialLinks.${index}.platform`}
              render={({ field: platform }) => (
                <Select value={platform.value} onValueChange={platform.onChange}>
                  <SelectTrigger className="w-36" aria-label={`Platform ${index + 1}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_PLATFORMS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {PLATFORM_LABELS[option]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <div className="flex flex-1 flex-col gap-1">
              <Input
                aria-label={`Link ${index + 1}`}
                placeholder="https://…"
                {...register(`socialLinks.${index}.url`)}
              />
              {errors.socialLinks?.[index]?.url ? (
                <p role="alert" className="text-xs text-destructive">
                  {errors.socialLinks[index].url.message}
                </p>
              ) : null}
            </div>
            <RemoveButton
              label={`Remove link ${index + 1}`}
              onClick={() => socialLinks.remove(index)}
            />
          </div>
        ))}
        <AddButton
          disabled={socialLinks.fields.length >= MAX_SOCIAL_LINKS}
          onClick={() => socialLinks.append({ platform: "github", url: "" })}
        >
          Add link
        </AddButton>
      </FormSection>

      <FormSection
        title="SEO"
        description="Search engine title and description. Empty uses the defaults."
      >
        <BilingualField
          label="SEO title"
          register={(locale) => register(`seoTitle.${locale}`)}
          errors={{ en: errors.seoTitle?.en?.message, id: errors.seoTitle?.id?.message }}
        />
        <BilingualField
          label="SEO description"
          multiline
          rows={2}
          register={(locale) => register(`seoDescription.${locale}`)}
          errors={{
            en: errors.seoDescription?.en?.message,
            id: errors.seoDescription?.id?.message,
          }}
        />
      </FormSection>

      <div className="sticky bottom-0 -mx-1 flex justify-end border-t bg-background/90 px-1 py-3 backdrop-blur">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? (
            <Loader2Icon aria-hidden="true" className="animate-spin" />
          ) : (
            <SaveIcon aria-hidden="true" />
          )}
          Save changes
        </Button>
      </div>
    </form>
  );
}
