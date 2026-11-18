"use client";

import { ExternalLinkIcon, FileTextIcon, Loader2Icon, Trash2Icon, UploadIcon } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";

import { ConfirmButton } from "@/components/admin/confirm-button";
import { useAdminAction } from "@/components/admin/use-admin-action";
import { Button } from "@/components/ui/button";
import { DOCUMENT_RULES, DOCUMENTS_BUCKET, publicFileUrl } from "@/lib/supabase/storage";
import { uploadDocumentFile } from "@/lib/supabase/upload-media";

import { setCvFile } from "../actions";

type CvLocale = "en" | "id";

const LABELS: Record<CvLocale, string> = { en: "English CV", id: "Indonesian CV" };

/** Upload, replace, or remove the CV PDF for each language (Case 03 M4 #9). */
export function CvManager({ paths }: { paths: Record<CvLocale, string | null> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(["en", "id"] as const).map((locale) => (
        <CvSlot key={locale} locale={locale} path={paths[locale]} />
      ))}
    </div>
  );
}

function CvSlot({ locale, path }: { locale: CvLocale; path: string | null }) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const { run, pending } = useAdminAction();
  const url = path ? publicFileUrl(path, DOCUMENTS_BUCKET) : null;

  async function upload(file: File) {
    setUploading(true);
    const result = await uploadDocumentFile(file, "cv");
    setUploading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    run(() => setCvFile({ locale, path: result.path }), `${LABELS[locale]} updated.`);
  }

  const busy = uploading || pending;

  return (
    <section className="flex flex-col gap-4 rounded-xl border bg-card p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <FileTextIcon aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h2 className="font-heading font-semibold">{LABELS[locale]}</h2>
          <p className="text-sm text-muted-foreground">
            {path ? "Visitors can download it." : "Not uploaded yet."}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" disabled={busy} asChild>
          <label htmlFor={inputId} className="cursor-pointer">
            {busy ? (
              <Loader2Icon aria-hidden="true" className="animate-spin" />
            ) : (
              <UploadIcon aria-hidden="true" />
            )}
            {path ? "Replace PDF" : "Upload PDF"}
          </label>
        </Button>
        {url ? (
          <Button variant="outline" size="sm" asChild>
            <a href={url} target="_blank" rel="noreferrer">
              <ExternalLinkIcon aria-hidden="true" />
              Open
            </a>
          </Button>
        ) : null}
        {path ? (
          <ConfirmButton
            title={`Remove the ${LABELS[locale]}?`}
            description="The PDF is deleted and the download button falls back to the other language, if any."
            confirmLabel="Remove"
            destructive
            onConfirm={() => run(() => setCvFile({ locale, path: null }), "CV removed.")}
            trigger={
              <Button variant="ghost" size="sm" disabled={busy}>
                <Trash2Icon aria-hidden="true" />
                Remove
              </Button>
            }
          />
        ) : null}
      </div>
      <input
        id={inputId}
        type="file"
        accept={DOCUMENT_RULES.mimeTypes.join(",")}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void upload(file);
        }}
      />
      <p className="text-xs text-muted-foreground">PDF only, up to 10 MB.</p>
    </section>
  );
}
