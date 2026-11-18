"use client";

import { ImageUpIcon, Loader2Icon, XIcon } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { MEDIA_RULES, publicFileUrl } from "@/lib/supabase/storage";
import { uploadMediaFile } from "@/lib/supabase/upload-media";
import { cn } from "@/lib/utils/cn";

import { ImageCropDialog } from "./image-crop-dialog";

const PREVIEW_HEIGHT_PX = 64;

/**
 * Picks one image, lets the owner crop it to `aspect` (CR-10), and uploads the result to the
 * media bucket. The old file is cleaned up by the server action when the form is saved.
 */
export function ImageUpload({
  label,
  folder,
  value,
  onChange,
  aspect,
  round = false,
}: {
  label: string;
  /** Path prefix inside the bucket, e.g. "career/logos". */
  folder: string;
  value: string | null;
  onChange: (path: string | null) => void;
  /** Width ÷ height of the crop frame, e.g. 1 for a logo or 16 / 9 for a thumbnail. */
  aspect: number;
  /** Round crop frame and preview, for the profile photo. */
  round?: boolean;
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [cropSource, setCropSource] = useState<string | null>(null);
  const previewUrl = value ? publicFileUrl(value) : null;

  function pick(file: File) {
    if (!(MEDIA_RULES.mimeTypes as readonly string[]).includes(file.type)) {
      toast.error("Use a JPG, PNG, or WebP image.");
      return;
    }
    setCropSource(URL.createObjectURL(file));
  }

  function closeCrop() {
    if (cropSource) URL.revokeObjectURL(cropSource);
    setCropSource(null);
  }

  async function upload(file: File) {
    setUploading(true);
    const result = await uploadMediaFile(file, folder);
    setUploading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    closeCrop();
    onChange(result.path);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <div
          style={{ width: PREVIEW_HEIGHT_PX * aspect, height: PREVIEW_HEIGHT_PX }}
          className={cn(
            "flex shrink-0 items-center justify-center overflow-hidden border bg-secondary",
            round ? "rounded-full" : "rounded-lg",
          )}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of a just-uploaded file
            <img src={previewUrl} alt="" className="size-full object-cover" />
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
            if (file) pick(file);
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        JPG, PNG, or WebP. You can crop it before it uploads. No SVG.
      </p>

      <ImageCropDialog
        sourceUrl={cropSource}
        aspect={aspect}
        round={round}
        onCancel={closeCrop}
        onCropped={upload}
      />
    </div>
  );
}
