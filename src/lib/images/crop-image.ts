/** A crop rectangle in source-image pixels (react-easy-crop's `croppedAreaPixels`). */
export type PixelCrop = { x: number; y: number; width: number; height: number };

/** Uploaded images are scaled down to at most this width; next/image resizes further. */
const MAX_OUTPUT_WIDTH = 1600;
const WEBP_QUALITY = 0.9;

/**
 * Cuts `crop` out of the image at `sourceUrl` in the browser and returns it as a WebP file,
 * ready for upload (CR-10).
 */
export async function cropImage(sourceUrl: string, crop: PixelCrop): Promise<File> {
  const image = await loadImage(sourceUrl);
  const scale = Math.min(1, MAX_OUTPUT_WIDTH / crop.width);

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(crop.width * scale);
  canvas.height = Math.round(crop.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available in this browser.");

  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY),
  );
  if (!blob) throw new Error("Could not create the cropped image.");
  return new File([blob], "cropped.webp", { type: "image/webp" });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read the image."));
    image.src = url;
  });
}
