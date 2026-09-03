import "server-only";

import { getOwn } from "@/lib/record";
import type { InterviewQuestion } from "@/lib/session/types";

import type { ExperienceLevel, Locale } from "../../types";
import {
  entriesFor,
  resolveBank,
  resolveBankById,
  TECH_SESSION_LENGTH,
  type ContentBank,
  type ContentLocale,
  type LocalizedText,
  type QuestionBankEntry,
} from "./content";

/**
 * The Tech question service: the only thing that turns authored content into
 * wire-shaped questions, and the only thing that knows how a question id is
 * spelled.
 *
 * It sits between the content repository (./content — what exists) and the
 * `ServerInterviewModule` adapter (./index.ts — the contract Core consumes).
 * Keeping id encoding here rather than in the adapter is what lets selection
 * and re-resolution share one definition; when those two drifted apart in an
 * earlier shape, §5.2 re-resolution silently stopped matching.
 *
 * Stateless and deterministic: no clock, no randomness, no I/O. Same inputs
 * always yield the same question, which is what makes a stateless route
 * handler able to re-derive a question it served on a previous request
 * without having stored anything.
 */

/* ------------------------------------------------------------------ */
/* Locale                                                              */
/* ------------------------------------------------------------------ */

/**
 * Wire locale tag → the locale the bank is authored in.
 *
 * The single place the two vocabularies meet. `Locale` in ../../types.ts is a
 * BCP-47 tag on the wire; `ContentLocale` is how bank files key their strings.
 * Keeping the mapping here — rather than making the bank speak BCP-47 or the
 * wire speak short codes — means adding a regional variant (`en-GB`) is one
 * arm of this switch, not a rewrite of every content file.
 *
 * Exhaustive by type: add a wire locale without a bank and this stops
 * compiling, which is the enforcement specs/002 §10 Q2 asks for (never accept
 * a locale the content cannot answer in).
 */
function contentLocaleFor(locale: Locale): ContentLocale {
  switch (locale) {
    case "en-US":
      return "en";
    case "vi-VN":
      return "vi";
  }
}

/**
 * The default locale for callers that have none.
 *
 * Only reachable from `resolveQuestion` when the route omits the optional
 * locale argument. Vietnamese because it is the app's default
 * (`DEFAULT_LOCALE` in src/lib/i18n/locale-context.tsx) and every bank entry
 * is authored in it first.
 */
const FALLBACK_CONTENT_LOCALE: ContentLocale = "vi";

/** Pick one locale's string out of an authored value. */
function text(value: LocalizedText, locale: ContentLocale): string {
  return value[locale];
}

/* ------------------------------------------------------------------ */
/* Question id codec                                                   */
/* ------------------------------------------------------------------ */

/**
 * `:` rather than `-`, because bank ids and level names both contain `-`
 * (`web-development`) and a shared delimiter makes the id ambiguous to
 * decode. Chosen over `/` so the id stays safe in a path segment if one is
 * ever added.
 */
const ID_SEPARATOR = ":";

/**
 * Question ids are `{bankId}:{level}:{index}`.
 *
 * Three properties matter, and each is load-bearing:
 *
 * 1. **It encodes the bank that answered, not the specialty that was asked
 *    for.** After a fallback those differ, and recording the request rather
 *    than the result would make re-resolution ambiguous the moment a
 *    specialty gains its own bank — every in-flight id would start resolving
 *    to different content.
 * 2. **It is stable across requests and deploys.** A restored session must
 *    match a persisted turn back to its question, and specs/002 §5.2
 *    re-resolution needs an id that means the same thing on every instance.
 * 3. **It is derived, never accepted.** The id is minted here from content
 *    coordinates; nothing reads an id out of a request and trusts it.
 *
 * `interviewQuestionSchema` caps ids at 64 characters. The longest possible
 * id today is `software-development:senior:4` at 29, leaving ample headroom —
 * but a bank id long enough to breach that cap would fail response
 * validation in the route's `finalize()`, so keep them short.
 */
function encodeQuestionId(
  bankId: string,
  level: ExperienceLevel,
  index: number
): string {
  return [bankId, level, String(index)].join(ID_SEPARATOR);
}

interface DecodedQuestionId {
  readonly bank: ContentBank;
  readonly level: ExperienceLevel;
  readonly index: number;
}

/**
 * Decode an id back to the exact entry it names, or null.
 *
 * Every failure mode returns null rather than throwing: the id arrives inside
 * a request body, so a malformed one is an expected input, not an exception.
 * The route turns null into INVALID_REQUEST with the field path.
 *
 * Ids minted before specialty scoping used a `{level}-{index}` form. Those
 * are rejected here rather than remapped, and that is deliberate: the flat
 * bank they indexed into has been split across three banks, so `junior-0`
 * no longer identifies any particular question. Remapping it would grade an
 * answer against content the candidate never saw — a worse outcome than the
 * clean rejection, which the client surfaces as a recoverable error.
 */
function decodeQuestionId(id: string): DecodedQuestionId | null {
  const parts = id.split(ID_SEPARATOR);
  if (parts.length !== 3) return null;

  const [bankId, level, rawIndex] = parts;

  const bank = resolveBankById(bankId);
  if (!bank) return null;

  // `level` is a plain string off the wire. Narrowing it through the bank's
  // own keys is what makes the cast below sound — there is no separate list
  // of levels to fall out of sync with. Keeping the looked-up entries also
  // means the length check below reads the same array `entriesFor` would
  // return, without asking `bank.questions` for it a second time.
  const entries = getOwn(bank.questions, level);
  if (!entries) return null;
  const experienceLevel = level as ExperienceLevel;

  // `Number("")` is 0 and `Number(" 3 ")` is 3, so neither is enough on its
  // own; the round-trip comparison rejects every non-canonical spelling.
  const index = Number(rawIndex);
  if (!Number.isInteger(index) || index < 0) return null;
  if (String(index) !== rawIndex) return null;
  if (index >= entries.length) return null;

  return { bank, level: experienceLevel, index };
}

/* ------------------------------------------------------------------ */
/* Projection to the wire type                                         */
/* ------------------------------------------------------------------ */

/**
 * Project an authored entry down to what Core is allowed to see.
 *
 * The omissions are the point. `correctOptionIndex` never appears in the
 * multiple-choice branch, and `rubric.criteria` / `difficulty_analysis` never
 * appear in the open branch — those fields are how an answer is graded, and
 * a candidate holding them can grade themselves. specs/002 §3.1 moved the
 * bank server-side for exactly this reason; this function is where that
 * boundary is actually drawn.
 */
function toQuestion(
  entry: QuestionBankEntry,
  bankId: string,
  level: ExperienceLevel,
  index: number,
  locale: ContentLocale
): InterviewQuestion {
  const id = encodeQuestionId(bankId, level, index);

  if (entry.type === "multiple_choice") {
    return {
      id,
      type: "multiple_choice",
      prompt: text(entry.question, locale),
      // Order is preserved across locales, which is what keeps the
      // server-only `correctOptionIndex` meaningful in every language.
      options: entry.options.map((option) => text(option, locale)),
      maxScore: entry.maxScore,
    };
  }

  return {
    id,
    type: "open",
    prompt: text(entry.question, locale),
    expectedKeyPoints: entry.expectedKeyPoints.map((point) =>
      text(point, locale)
    ),
    maxScore: entry.rubric.maxScore,
    requiresPractice: entry.requiresPractice,
  };
}

/* ------------------------------------------------------------------ */
/* Public surface                                                      */
/* ------------------------------------------------------------------ */

/**
 * A question paired with the authored entry it came from.
 *
 * Both halves are returned together because grading needs the entry (for the
 * multiple-choice answer key) while the response needs the question, and
 * looking the entry up a second time would mean decoding the id twice.
 */
export interface ResolvedQuestion {
  readonly question: InterviewQuestion;
  readonly entry: QuestionBankEntry;
}

/**
 * The question for `turnIndex` of a session in `specialtyId` at `level`.
 *
 * Returns null when `turnIndex` is outside the session, which the route
 * treats as a completed session rather than an error — the client legitimately
 * reaches the end.
 *
 * Questions cycle when a level's bank holds fewer entries than
 * `TECH_SESSION_LENGTH`. That is a content gap, not a bug in the selection:
 * with a bank of 3 and a session of 5, turns 3 and 4 repeat turns 0 and 1.
 * The fix is to author more questions at that level, and the modulo keeps the
 * session completable in the meantime instead of ending it early.
 */
export function selectQuestion(
  specialtyId: string | undefined,
  level: ExperienceLevel,
  turnIndex: number,
  locale: Locale
): ResolvedQuestion | null {
  if (!Number.isInteger(turnIndex)) return null;
  if (turnIndex < 0 || turnIndex >= TECH_SESSION_LENGTH) return null;

  const bank = resolveBank(specialtyId);
  const entries = entriesFor(bank, level);
  const index = turnIndex % entries.length;

  return {
    question: toQuestion(
      entries[index],
      bank.id,
      level,
      index,
      contentLocaleFor(locale)
    ),
    entry: entries[index],
  };
}

/**
 * Re-resolve a question from the server's own content by id.
 *
 * This is the enforcement point for specs/002 §5.2: the client echoes
 * question content back in the transcript, and the server must grade only
 * against its own copy. Without it a candidate could post a question carrying
 * one trivially-matched key point and award themselves full marks.
 *
 * Returns null for any id the repository does not currently mint — unknown
 * bank, unknown level, out-of-range index, or a stale pre-scoping id.
 *
 * `locale` matters here as much as it does for selection: the open-question
 * scorer measures how much of `expectedKeyPoints` an answer covers, so
 * re-resolving in a different language than the candidate was asked in would
 * compare English key points against a Vietnamese answer and score near zero.
 */
export function resolveQuestion(
  questionId: string,
  locale?: Locale
): ResolvedQuestion | null {
  const decoded = decodeQuestionId(questionId);
  if (!decoded) return null;

  const { bank, level, index } = decoded;
  const entry = entriesFor(bank, level)[index];

  return {
    question: toQuestion(
      entry,
      bank.id,
      level,
      index,
      locale ? contentLocaleFor(locale) : FALLBACK_CONTENT_LOCALE
    ),
    entry,
  };
}

/**
 * The authored entry behind an id, without projecting it to a question.
 *
 * For a caller that already holds a valid, locale-correct `InterviewQuestion`
 * (because it came from `selectQuestion`/`resolveQuestion` moments earlier)
 * and only needs the server-only grading material — the multiple-choice
 * answer key — going through `resolveQuestion` again would redo the locale
 * projection (mapping every prompt and option string) purely to discard the
 * result. This stops at the entry.
 */
export function resolveEntry(questionId: string): QuestionBankEntry | null {
  const decoded = decodeQuestionId(questionId);
  if (!decoded) return null;

  return entriesFor(decoded.bank, decoded.level)[decoded.index];
}
