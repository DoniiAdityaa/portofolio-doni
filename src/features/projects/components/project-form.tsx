"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { BilingualField } from "@/components/admin/bilingual-field";
import { FormActions } from "@/components/admin/form-actions";
import { FormField } from "@/components/admin/form-field";
import { FormSection } from "@/components/admin/form-section";
import { ImageUpload } from "@/components/admin/image-upload";
import { MarkdownField } from "@/components/admin/markdown-field";
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

import { saveProject } from "../actions";
import { FEATURED_PROJECTS_LIMIT } from "../constants";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUSES,
  type ProjectFormValues,
  projectFormSchema,
  slugify,
} from "../schema";
import { CategorySelect } from "./category-select";
import { GalleryEditor } from "./gallery-editor";

const BACK_HREF = "/admin/projects";

const CASE_STUDY_SECTIONS = [
  { name: "overview", label: "Overview" },
  { name: "problem", label: "Problem" },
  { name: "solution", label: "Solution" },
  { name: "features", label: "Key features" },
  { name: "challenges", label: "Challenges and learnings" },
] as const;

const LINK_FIELDS = [
  { name: "repoUrl", label: "Repository" },
  { name: "demoUrl", label: "Live demo" },
  { name: "playStoreUrl", label: "Google Play" },
  { name: "appStoreUrl", label: "App Store" },
] as const;

/** Add or edit a project and its case study (Case 03 M4 #8). */
export function ProjectForm({
  defaultValues,
  types,
  categories,
  skillOptions,
}: {
  defaultValues: ProjectFormValues;
  types: AdminCategory[];
  categories: AdminCategory[];
  skillOptions: SkillOption[];
}) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });
  const englishTitle = useWatch({ control, name: "title.en" });
  const caseStudy = useWatch({
    control,
    name: ["overview", "problem", "solution", "features", "challenges"],
  });
  const projectFolder = `projects/${defaultValues.id ?? "new"}`;

  async function onSubmit(values: ProjectFormValues) {
    const result = await saveProject(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(values.id ? "Project updated." : "Project added.");
    router.push(BACK_HREF);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-3xl flex-col gap-6">
      <FormSection title="Project">
        <BilingualField
          label="Title"
          register={(locale) => register(`title.${locale}`)}
          errors={{ en: errors.title?.en?.message, id: errors.title?.id?.message }}
        />
        <FormField
          id="slug"
          label="URL slug"
          hint={`Empty uses the title: /projects/${slugify(englishTitle) || "…"}`}
          error={errors.slug?.message}
        >
          <Input id="slug" autoComplete="off" placeholder="my-project" {...register("slug")} />
        </FormField>
        <BilingualField
          label="Summary"
          hint="One or two sentences on the project card."
          multiline
          rows={2}
          register={(locale) => register(`summary.${locale}`)}
          errors={{ en: errors.summary?.en?.message, id: errors.summary?.id?.message }}
        />
        <Controller
          control={control}
          name="thumbnailPath"
          render={({ field }) => (
            <ImageUpload
              label="Thumbnail"
              aspect={16 / 9}
              folder={projectFolder}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <CategorySelect
            id="typeId"
            label="Type"
            control={control}
            name="typeId"
            options={types}
            error={errors.typeId?.message}
          />
          <CategorySelect
            id="categoryId"
            label="Category"
            control={control}
            name="categoryId"
            options={categories}
            error={errors.categoryId?.message}
          />
          <FormField id="projectStatus" label="Progress">
            <Controller
              control={control}
              name="projectStatus"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="projectStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {PROJECT_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="startDate" label="Started" error={errors.startDate?.message}>
            <Input id="startDate" type="date" {...register("startDate")} />
          </FormField>
          <FormField
            id="endDate"
            label="Finished"
            hint="Leave empty while it is ongoing."
            error={errors.endDate?.message}
          >
            <Input id="endDate" type="date" {...register("endDate")} />
          </FormField>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-primary" {...register("isFeatured")} />
          Featured on Home (up to {FEATURED_PROJECTS_LIMIT})
        </label>
      </FormSection>

      <FormSection title="Links" description="Only filled links are shown.">
        <div className="grid gap-4 sm:grid-cols-2">
          {LINK_FIELDS.map(({ name, label }) => (
            <FormField key={name} id={name} label={label} error={errors[name]?.message}>
              <Input id={name} type="url" placeholder="https://…" {...register(name)} />
            </FormField>
          ))}
        </div>
      </FormSection>

      <FormSection
        title="Case study"
        description="Markdown supported. Empty sections are hidden on the project page."
      >
        {CASE_STUDY_SECTIONS.map(({ name, label }, index) => (
          <MarkdownField
            key={name}
            label={label}
            register={(locale) => register(`${name}.${locale}`)}
            values={caseStudy[index] ?? { en: "", id: "" }}
            error={errors[name]?.en?.message ?? errors[name]?.id?.message}
          />
        ))}
        <Controller
          control={control}
          name="skillIds"
          render={({ field }) => (
            <SkillPicker
              label="Tech stack"
              options={skillOptions}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </FormSection>

      <FormSection title="Screenshots">
        <GalleryEditor control={control} register={register} projectFolder={projectFolder} />
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
