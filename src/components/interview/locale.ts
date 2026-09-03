import type { InterviewSessionContextShape } from "@/lib/session/types";
import type { Locale as UiLocale } from "@/lib/i18n/types";

/**
 * The interview's wire locale tag — `"vi-VN" | "en-US"`.
 *
 * Named from the lib mirror rather than imported from `@/modules/types` so
 * this file has no reason to reach into a module; `src/modules/types.ts`
 * asserts at compile time that the two stay identical.
 */
export type WireLocale = InterviewSessionContextShape["locale"];

/**
 * UI language preference → the locale the interview is conducted in.
 *
 * The same shape of mapping `toExperienceLevel` performs for the level picker,
 * and separate for the same reason: the UI vocabulary is a display preference
 * with its own history, while the wire vocabulary is gated on a question bank
 * actually being able to answer in that language (specs/002 §10 Q2). Keeping
 * them apart means adding a UI language cannot silently request interview
 * content that does not exist — the new arm has to be added here first, and
 * it will not compile until the wire union admits the tag.
 *
 * Exhaustive over `UiLocale`: a new UI language stops the build here rather
 * than falling through to a default and quietly serving the wrong language.
 */
export function toWireLocale(locale: UiLocale): WireLocale {
  switch (locale) {
    case "en":
      return "en-US";
    case "vi":
      return "vi-VN";
  }
}
