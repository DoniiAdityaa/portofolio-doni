"use client";

import { ImageUpIcon, Loader2Icon, XIcon } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { MEDIA_RULES, publicFileUrl } from "@/lib/supabase/storage";
import { uploadMediaFile } from "@/lib/supabase/upload-media";

/**
 * Uploads one image to the media bucket and reports its path (Case 03 M4).
 * Type and size are checked here for quick feedback; the bucket enforces them too.
 * The old file is cleaned up by the server action when the form is saved.
 */
export function ImageUpload({
  label,
  folder,
  value,
  onChange,
}: {
  label: string;
  /** Path prefix inside the bucket, e.g. "career/logos". */
  folder: string;
  value: string | null;
  onChange: (path: string | null) => void;
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const previewUrl = value ? publicFileUrl(value) : null;

  async function upload(file: File) {
    setUploading(true);
    const result = await uploadMediaFile(file, folder);
    setUploading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    onChange(result.path);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-secondary">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of a just-uploaded file
            <img src={previewUrl} alt="" className="size-full object-contain" />
          ) : (
            <ImageUpIcon aria-hidden="true" className="size-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
            <label htmlFor={inputId} className="cursor-pointer">
              {uploading ? <Loader2Icon aria-hidden="true" className="animate-spin" /> : null}
              {value ? "Replace" : "Upload"}
            </label>
          </Button>
          {value ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
              <XIcon aria-hidden="true" />
              Remove
            </Button>
          ) : null}
        </div>
        <input
          id={inputId}
          type="file"
          accept={MEDIA_RULES.mimeTypes.join(",")}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void upload(file);
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">JPG, PNG, or WebP, up to 5 MB. No SVG.</p>
    </div>
  );
}
