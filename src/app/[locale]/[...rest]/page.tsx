import { notFound } from "next/navigation";

// This route only ever renders the 404 page, so instant-navigation validation has nothing to check.
export const instant = false;

// Unknown paths inside a locale (e.g. /en/unknown) render the translated 404 page.
export default function CatchAllPage() {
  notFound();
}
