"use client";

import { ImagePlusIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import { useId, useState } from "react";
import { type Control, type UseFormRegister, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

import { SortableList } from "@/components/admin/sortable-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MEDIA_RULES, publicFileUrl } from "@/lib/supabase/storage";
import { uploadMediaFile } from "@/lib/supabase/upload-media";

import { MAX_GALLERY_IMAGES, type ProjectFormValues } from "../schema";

/**
 * Project screenshots (Case 01 §5.4): upload several at once, drag to reorder, add alt
 * text and orientation. Removed files are deleted when the project is saved.
 */
export function GalleryEditor({
  control,
  register,
  projectFolder,
}: {
  control: Control<ProjectFormValues>;
  register: UseFormRegister<ProjectFormValues>;
  projectFolder: string;
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const { fields, append, remove, move } = useFieldArray({ control, name: "images" });
  const remaining = MAX_GALLERY_IMAGES - fields.length;

  async function upload(files: File[]) {
    setUploading(true);
    for (const file of files.slice(0, remaining)) {
      const result = await uploadMediaFile(file, `${projectFolder}/gallery`);
      if (!result.ok) {
        toast.error(result.error);
        continue;
      }
      append({ path: result.path, alt: { en: "", id: "" }, orientation: "landscape" });
    }
    setUploading(false);
  }

  function reorder(ids: string[]) {
    // Apply the new order one move at a time; field ids identify each image.
    const current = fields.map((field) => field.id);
    ids.forEach((id, target) => {
      const from = current.indexOf(id);
      if (from !== target) {
        move(from, target);
        current.splice(target, 0, ...current.splice(from, 1));
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium">
          Gallery{" "}
          <span className="font-normal text-muted-foreground">
            ({fields.length}/{MAX_GALLERY_IMAGES})
          </span>
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading || remaining <= 0}
          asChild
        >
          <label htmlFor={inputId} className="cursor-pointer">
            {uploading ? (
              <Loader2Icon aria-hidden="true" className="animate-spin" />
            ) : (
              <ImagePlusIcon aria-hidden="true" />
            )}
            Add screenshots
          </label>
        </Button>
        <input
          id={inputId}
          type="file"
          multiple
          accept={MEDIA_RULES.mimeTypes.join(",")}
          className="sr-only"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            event.target.value = "";
            if (files.length > 0) void upload(files);
          }}
        />
      </div>

      {fields.length === 0 ? (
        <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          No screenshots yet.
        </p>
      ) : (
        <SortableList
          label="Gallery images"
          items={fields}
          onReorder={reorder}
          renderItem={(field) => {
            const index = fields.findIndex((item) => item.id === field.id);
            const url = publicFileUrl(field.path);

            return (
              <>
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                  <img src={url} alt="" className="h-14 w-20 shrink-0 rounded object-cover" />
                ) : null}
                <div className="grid min-w-0 flex-1 gap-1.5 sm:grid-cols-2">
                  <Input
                    aria-label={`Image ${index + 1} alt text (EN)`}
                    placeholder="Alt text (EN)"
                    {...register(`images.${index}.alt.en`)}
                  />
                  <Input
                    aria-label={`Image ${index + 1} alt text (ID)`}
                    placeholder="Alt text (ID)"
                    {...register(`images.${index}.alt.id`)}
                  />
                </div>
                <select
                  aria-label={`Image ${index + 1} orientation`}
                  className="h-9 rounded-md border bg-transparent px-2 text-sm"
                  {...register(`images.${index}.orientation`)}
                >
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                </select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove image ${index + 1}`}
                  title="Remove"
                  onClick={() => remove(index)}
                >
                  <Trash2Icon aria-hidden="true" />
                </Button>
              </>
            );
          }}
        />
      )}
      <p className="text-xs text-muted-foreground">
        JPG, PNG, or WebP, up to 5 MB each. Drag to reorder; the first image leads the gallery.
      </p>
    </div>
  );
}
