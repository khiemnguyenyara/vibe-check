import type { Locale } from "./types";

/** SSR-safe and never throws — same rationale as `session/storage.ts`. */

const LOCALE_KEY = "vibe-check:locale";

function isLocale(value: unknown): value is Locale {
  return value === "vi" || value === "en";
}

export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCALE_KEY);
    return isLocale(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function writeStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    // Private browsing / quota exceeded — the choice just won't persist.
  }
}
