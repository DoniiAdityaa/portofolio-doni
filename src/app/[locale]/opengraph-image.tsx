import { ImageResponse } from "next/og";

import { getSiteSettings } from "@/features/settings/queries";
import { localize } from "@/lib/i18n/localize";
import { routing } from "@/lib/i18n/routing";

export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand colors from the dark theme (Case 01 §3.2); ImageResponse cannot read CSS variables.
const BACKGROUND = "#0b1120";
const FOREGROUND = "#e2e8f0";
const MUTED = "#94a3b8";
const SKY = "#38bdf8";
const TEAL = "#2dd4bf";

/**
 * The link preview image for LinkedIn, X, and chat apps (Case 03 M8): the owner's name and
 * headline from Site settings, in the page's language. Every page under a locale uses it.
 */
export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requested } = await params;
  const locale = routing.locales.find((item) => item === requested) ?? routing.defaultLocale;
  const settings = await getSiteSettings();
  const name = settings.name || "Portfolio";
  const headline = localize(settings.headline, locale);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: BACKGROUND,
        color: FOREGROUND,
      }}
    >
      <div style={{ display: "flex", width: 96, height: 8, borderRadius: 4, background: SKY }} />
      <div style={{ display: "flex", marginTop: 40, fontSize: 88, fontWeight: 700 }}>{name}</div>
      {headline ? (
        <div style={{ display: "flex", marginTop: 16, fontSize: 44, color: SKY }}>{headline}</div>
      ) : null}
      <div style={{ display: "flex", marginTop: 48, fontSize: 28, color: MUTED }}>
        <span style={{ color: TEAL }}>●</span>&nbsp; Projects · Career · Achievements
      </div>
    </div>,
    size,
  );
}
