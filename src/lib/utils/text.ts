/** Splits multi-line admin text into trimmed, non-empty lines (one list item per line). */
export function splitLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
