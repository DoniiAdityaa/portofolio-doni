import { Dancing_Script, Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

/** Fonts from Case 01 §3.3, exposed as CSS variables used by globals.css. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/** Handwritten signature on the About page (CR-03). Not preloaded: only one page uses it. */
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-dancing-script",
  display: "swap",
  preload: false,
});

export const fontVariables = [
  spaceGrotesk.variable,
  inter.variable,
  jetbrainsMono.variable,
  dancingScript.variable,
].join(" ");
