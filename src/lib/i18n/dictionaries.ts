import en from "./locales/en.json";
import vi from "./locales/vi.json";
import type { Locale } from "./types";

/** `vi` is the canonical shape — `en` (and any future locale) is checked against it. */
export type Dictionary = typeof vi;

export const dictionaries: Record<Locale, Dictionary> = { vi, en };
