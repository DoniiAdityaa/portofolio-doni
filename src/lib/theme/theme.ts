export type Theme = "dark" | "light";

export const DEFAULT_THEME: Theme = "dark";
export const THEME_STORAGE_KEY = "theme";

/**
 * Runs before the page paints (inlined in <head>) so a returning visitor who chose
 * light mode never sees a dark flash. Kept tiny and dependency-free on purpose.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

export function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : DEFAULT_THEME;
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode); the choice then lasts for this visit only.
  }
}

/** Notifies `callback` whenever the theme attribute on <html> changes. */
export function subscribeToTheme(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
