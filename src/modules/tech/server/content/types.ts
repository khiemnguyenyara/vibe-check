import "server-only";

import { LIMITS } from "@/lib/api/interview-contract";
import type { TechSpecialtyId } from "@/lib/specialty-ids";

import type { ExperienceLevel } from "../../../types";

/**
 * Shapes for the Tech content repository.
 *
 * Server-only by construction, for the same reason the bank itself is
 * (specs/002-architecture-and-api-contracts.md §3.1): a type file is cheap to
 * import accidentally, and an accidental import is exactly how a rubric ends
 * up reachable from DevTools.
 */

/* ------------------------------------------------------------------ */
/* Localization                                                        */
/* ------------------------------------------------------------------ */

/**
 * The locales question content is authored in.
 *
 * Matches `Locale` in src/lib/i18n/types.ts by value, but is declared
 * separately and deliberately — not imported, even though a type-only import
 * would cost nothing at runtime. Two independent reasons, not one:
 *
 * 1. **The bundle boundary.** Bank content is NOT translated through
 *    `src/lib/i18n/dictionaries.ts`: that module statically imports every
 *    locale JSON, so anything placed in it ships to the browser — and
 *    `expectedKeyPoints` is the answer key. Routing questions through the UI
 *    dictionary would undo exactly what specs/002 §3.1 moved the bank
 *    server-side to achieve.
 * 2. **The capability boundary.** This mirrors the same split
 *    `src/components/interview/locale.ts` draws between `UiLocale` and
 *    `WireLocale`, for the same reason: a UI display preference and "content
 *    actually exists in this language" are different claims that happen to
 *    share values today, and the codebase's convention is to keep every
 *    layer in that chain (UI → wire → content) as its own named type with an
 *    explicit mapping function between them (`toWireLocale`, and
 *    `contentLocaleFor` in ../question-service.ts), rather than reuse one
 *    union across layers. Merging `ContentLocale` into `Locale` would be the
 *    one layer in the chain that breaks that pattern: a UI language added
 *    without bank content for it would silently type-check here instead of
 *    failing at the same explicit-mapping seam every other layer fails at.
 */
export type ContentLocale = "vi" | "en";

/** One string, in every locale the bank is authored in. */
export type LocalizedText = Readonly<Record<ContentLocale, string>>;

/* ------------------------------------------------------------------ */
/* Question entries                                                    */
/* ------------------------------------------------------------------ */

/** Authoring aid only — never crosses the wire, never reaches the scorer. */
export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";

/* ------------------------------------------------------------------ */
/* Bounded lists                                                       */
/* ------------------------------------------------------------------ */

/**
 * `readonly [T]` up to `readonly [T, T, ..., T]` with `N` elements.
 *
 * Used to give the wire's array-length caps a compile-time equivalent. The
 * bounds are read from `LIMITS` rather than written as literals, so the
 * schema in src/lib/api/interview-contract.ts stays the single definition —
 * tighten it there and authoring tightens in the same commit.
 *
 * The cost is error-message quality: an over-long list reports "not
 * assignable to any union member" rather than "too many key points". Naming
 * the aliases below keeps `KeyPointList` / `OptionList` in the message, which
 * recovers most of the signal.
 */
type UpTo<
  T,
  N extends number,
  Acc extends readonly T[] = readonly [T],
> = Acc["length"] extends N ? Acc : Acc | UpTo<T, N, readonly [...Acc, T]>;

/**
 * 1..`LIMITS.maxKeyPoints` expected key points.
 *
 * Subsumes `NonEmpty` for this field — the minimum of one comes free from the
 * base case. Note that the ceiling is a hard limit, not a target: because an
 * open answer scores `covered / total`, every additional key point makes the
 * question strictly harder to score well on for the same answer. House style
 * is 4–6; the ceiling should never be approached.
 */
export type KeyPointList = UpTo<LocalizedText, typeof LIMITS.maxKeyPoints>;

/**
 * 2..`LIMITS.maxOptions` choices, matching the schema's `.min(2)`.
 *
 * `Exclude` drops the single-element arm — one option is not a choice, and
 * `multipleChoiceInterviewQuestionSchema` rejects it at the wire.
 */
export type OptionList = Exclude<
  UpTo<LocalizedText, typeof LIMITS.maxOptions>,
  readonly [LocalizedText]
>;

/**
 * A valid index into `OptionList`.
 *
 * Catches an index past the ceiling. It deliberately does NOT tie the index
 * to *this* entry's option count — doing so needs a generic factory per
 * entry, which would destroy the plain-object-literal authoring style the
 * whole layer is built on, and it still could not catch the failure that
 * actually matters (an in-range index pointing at the wrong option). That one
 * needs review, not types.
 */
export type OptionIndex = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * The uniform per-question score.
 *
 * Every authored entry uses 10, the scorer works in ratios, and the UI
 * assumes one scale. Pinning the literal fully closes the wire's
 * `int 1..100`. A future question worth more is a one-token change here.
 */
export type MaxScore = 10;

/**
 * One authored question, with the grading material Core never sees.
 *
 * The wire type (`InterviewQuestion` in src/lib/session/types.ts) is a strict
 * subset of this, resolved to a single locale: `rubric.criteria`,
 * `difficulty_analysis`, and `correctOptionIndex` are deliberately absent from
 * it. That asymmetry is the point — the question service projects an entry
 * down to the wire type, and the fields that would let a candidate grade
 * themselves have no projection.
 *
 * Note the shape of `expectedKeyPoints` and `options`: a list of localized
 * strings, NOT a localized list of strings. That is load-bearing. A
 * `Record<locale, string[]>` lets `vi` hold three key points while `en` holds
 * five, and since an open answer scores `covered / total`, the same answer
 * would then earn a different score in each language. Indexing by point first
 * makes the counts equal by construction, and it keeps `correctOptionIndex`
 * meaningful across every locale rather than only the one it was authored in.
 */
export type QuestionBankEntry =
  | {
      readonly type: "open";
      readonly question: LocalizedText;
      readonly expectedKeyPoints: KeyPointList;
      readonly rubric: {
        readonly maxScore: MaxScore;
        readonly criteria: LocalizedText;
      };
      readonly difficulty_analysis: {
        readonly suggestedLevel: DifficultyLevel;
        /** Internal authoring note. Never sent, so never localized. */
        readonly reasoning: string;
      };
      /** Whether the code-scratchpad Workspace pane is relevant to this question. */
      readonly requiresPractice: boolean;
    }
  | {
      readonly type: "multiple_choice";
      readonly question: LocalizedText;
      readonly options: OptionList;
      /** Index into `options`. Server-only — never enters the wire projection. */
      readonly correctOptionIndex: OptionIndex;
      readonly maxScore: MaxScore;
      readonly difficulty_analysis: {
        readonly suggestedLevel: DifficultyLevel;
        readonly reasoning: string;
      };
    };

/**
 * A list that cannot be empty, enforced by the compiler rather than by a
 * runtime guard.
 *
 * This is load-bearing. Question selection is `turnIndex % bank.length`, and
 * a zero-length bank makes that `NaN`, which then indexes to `undefined` and
 * surfaces as a 500 several frames away from the empty array that caused it.
 * Making the empty case unrepresentable removes the failure mode instead of
 * detecting it.
 */
export type NonEmpty<T> = readonly [T, ...T[]];

/**
 * Every experience level is required and every level must have content.
 *
 * A partially-filled bank is not allowed on purpose: a specialty either has
 * enough authored content to run a session at all four levels, or it does not
 * get registered and falls back to the general bank as a whole
 * (see ./index.ts). Half-registering a specialty would mean a `staff`
 * candidate silently receiving `junior` questions, which is worse than the
 * honest fallback.
 *
 * This is also why "which level should I author?" is not a question the
 * content author gets to answer — the picker lets the candidate choose any
 * level, so a bank owes content at all of them.
 */
export type LevelBank = Readonly<
  Record<ExperienceLevel, NonEmpty<QuestionBankEntry>>
>;

/**
 * One registered bank of content.
 *
 * `id` is what the question id encodes, NOT the requested specialty — see
 * ../question-service.ts. That distinction is what keeps §5.2 re-resolution
 * exact after a fallback: the id records which bank actually answered, so
 * resolving it later cannot land on different content.
 */
export interface ContentBank {
  /**
   * Stable and permanent. It appears inside persisted question ids, so
   * renaming one orphans every in-flight session that references it — treat
   * it with the same permanence `interface-contracts.md` §5 gives
   * `ModuleDefinition.id`.
   *
   * For a specialty bank this MUST equal the corresponding `Specialty.id` in
   * src/lib/domains.ts. It is typed as a plain string rather than imported
   * from there because `domains.ts` pulls in lucide-react icons, and a
   * server-only content file has no business dragging a client icon set into
   * its import graph.
   */
  readonly id: string;
  /** Human-readable, for authoring and code review only. Never sent. */
  readonly label: string;
  readonly questions: LevelBank;
}

/**
 * A bank that answers for a real tech specialty.
 *
 * The narrowing that `ContentBank.id: string` could not express before
 * `@/lib/specialty-ids` existed: annotate a specialty bank with this and a
 * misspelled id becomes a compile error rather than dead content that
 * `resolveBank` silently skips in favour of the general bank.
 *
 * `generalBank` stays a plain `ContentBank` on purpose — `"general"` is
 * deliberately not a specialty id, and `ContentBank.id` must stay wide enough
 * to hold it.
 */
export type SpecialtyBank = ContentBank & {
  readonly id: TechSpecialtyId;
};
