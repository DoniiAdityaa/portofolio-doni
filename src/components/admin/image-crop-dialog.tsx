"use client";

import { CropIcon, Loader2Icon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cropImage } from "@/lib/images/crop-image";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

/**
 * Crop step before an upload (CR-10): drag to position, pinch, scroll, or use the slider to
 * zoom. `aspect` fixes the frame, e.g. 1 for a profile photo or 16/9 for a thumbnail.
 */
export function ImageCropDialog({
  sourceUrl,
  aspect,
  round = false,
  onCancel,
  onCropped,
}: {
  /** Object URL of the picked file; `null` keeps the dialog closed. */
  sourceUrl: string | null;
  aspect: number;
  round?: boolean;
  onCancel: () => void;
  onCropped: (file: File) => Promise<void>;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [area, setArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  async function confirm() {
    if (!sourceUrl || !area) return;
    setSaving(true);
    try {
      await onCropped(await cropImage(sourceUrl, area));
    } finally {
      setSaving(false);
      setCrop({ x: 0, y: 0 });
      setZoom(MIN_ZOOM);
    }
  }

  return (
    <Dialog open={sourceUrl !== null} onOpenChange={(open) => !open && !saving && onCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crop image</DialogTitle>
          <DialogDescription>Drag to position it and zoom to frame it.</DialogDescription>
        </DialogHeader>

        <div className="relative h-72 overflow-hidden rounded-lg bg-black sm:h-80">
          {sourceUrl ? (
            <Cropper
              image={sourceUrl}
              crop={crop}
              zoom={zoom}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              aspect={aspect}
              cropShape={round ? "round" : "rect"}
              showGrid={!round}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setArea(pixels)}
            />
          ) : null}
        </div>

        <label className="flex items-center gap-3 text-sm">
          <ZoomOutIcon aria-hidden="true" className="size-4 text-muted-foreground" />
          <span className="sr-only">Zoom</span>
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="flex-1 accent-primary"
          />
          <ZoomInIcon aria-hidden="true" className="size-4 text-muted-foreground" />
        </label>

        <DialogFooter>
          <Button variant="outline" disabled={saving} onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={saving || !area} onClick={() => void confirm()}>
            {saving ? (
              <Loader2Icon aria-hidden="true" className="animate-spin" />
            ) : (
              <CropIcon aria-hidden="true" />
            )}
            Crop and upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
