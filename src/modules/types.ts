import type {
  InterviewSessionContextShape,
  TurnOutcome,
  TurnSubmission,
} from "@/lib/session/types";
import type {
  interviewSessionContextSchema,
  turnResponseSchema,
} from "@/lib/api/interview-contract";
import type { z } from "zod";

/**
 * See docs/interface-contracts.md — this file is the compile-time
 * enforcement of that contract. Any change here must update every
 * ModuleDefinition implementation in the same commit (see §5, versioning).
 */

export type ExperienceLevel = "junior" | "mid" | "senior" | "staff";

/**
 * Closed union, not `string`. Same reasoning interface-contracts.md §3.2
 * rule 4 gives for ExperienceLevel: a free-form locale lets a caller request
 * content that does not exist, and the failure surfaces as wrong-language
 * output rather than a type error.
 *
 * Widened to `en-US` when the tech question bank gained English content. The
 * rule specs/002 §10 Q2 states still holds and is what gates the next entry:
 * a locale belongs here only once a bank can actually answer in it, because
 * accepting one with no content is a 200 response in the wrong language,
 * which is worse than a rejection.
 *
 * These are BCP-47 wire tags, distinct from the UI's `"vi" | "en"` in
 * src/lib/i18n/types.ts. The interview route maps between them; keeping them
 * separate means a UI language toggle cannot silently request interview
 * content that does not exist.
 */
export type Locale = "vi-VN" | "en-US";

export interface InterviewSessionContext {
  readonly sessionId: string;
  readonly candidateName?: string;
  readonly experienceLevel: ExperienceLevel;
  readonly focusAreas: readonly string[];
  readonly locale: Locale;
}

/**
 * Must be a pure function of `context`: no Date.now()/Math.random()/env
 * reads, no I/O, never throws (missing optional fields get domain-level
 * defaults). See docs/interface-contracts.md §3.2.
 */
export type SystemPromptBuilder = (
  context: InterviewSessionContext
) => string;

export type SessionStatus = "idle" | "in_progress" | "paused" | "completed";

export interface WorkspaceSubmission {
  readonly type: string;
  readonly payload: unknown;
  readonly submittedAt: string;
}

export interface ModuleWorkspaceProps {
  readonly context: InterviewSessionContext;
  readonly status: SessionStatus;
  readonly onSubmit: (submission: WorkspaceSubmission) => void;
}

/**
 * Optional capability a module may provide so Core can drive the interview
 * loop generically: Core owns the loop and the session state, the module
 * owns the content and the grading criteria.
 *
 * ## Why one method instead of fetchNextQuestion + evaluateAnswer
 *
 * The original shape had two methods, which mapped to two round trips against
 * the single route in specs/002-architecture-and-api-contracts.md §4.1 — and
 * worse, could not be batched: `evaluateAnswer(question, answer, context)`
 * never received the transcript that a stateless request requires. The seam
 * was one method off.
 *
 * Collapsing to `submitTurn` also removes a real failure mode. With two
 * calls, grading could succeed while the next-question fetch failed, leaving
 * a graded turn with no question to answer. One call is atomic: the turn
 * either advances completely or not at all, which is what makes the Session
 * Engine's "a failed turn is resumable" guarantee true rather than aspirational.
 *
 * This was a breaking change to the contract, permitted by
 * docs/interface-contracts.md §5 because exactly one module implemented it
 * and was migrated in the same commit.
 */
export interface InterviewService {
  submitTurn(input: TurnSubmission): Promise<TurnOutcome>;
}

export type { TurnSubmission, TurnOutcome };

export interface ModuleDefinition {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly getSystemPrompt: SystemPromptBuilder;
  /**
   * Optional per the additive rule in docs/interface-contracts.md §5 — a
   * module without one (e.g. the marketing stub) still satisfies the
   * contract; Core renders an "unavailable" state for it.
   */
  readonly interviewService?: InterviewService;
}

/* ------------------------------------------------------------------ */
/* Compile-time drift guard                                            */
/* ------------------------------------------------------------------ */

/**
 * InterviewSessionContext crosses the wire, so it must stay identical to
 * `interviewSessionContextSchema`. The assertion lives here rather than
 * beside the schema because docs/hla.md §6 forbids src/lib importing from
 * src/modules — this direction is the legal one.
 *
 * Add or retype a field on either side and this stops compiling.
 */
type _DeepMutable<T> = T extends readonly (infer U)[]
  ? _DeepMutable<U>[]
  : T extends object
    ? { -readonly [K in keyof T]: _DeepMutable<T[K]> }
    : T;

type _Equals<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

type _Expect<T extends true> = T;

type _ContextMatches = _Expect<
  _Equals<
    _DeepMutable<InterviewSessionContext>,
    z.infer<typeof interviewSessionContextSchema>
  >
>;

type _TurnOutcomeMatches = _Expect<
  _Equals<_DeepMutable<TurnOutcome>, z.infer<typeof turnResponseSchema>>
>;

/** lib names the context shape structurally; this proves it stayed identical. */
type _ContextShapeMatches = _Expect<
  _Equals<InterviewSessionContext, InterviewSessionContextShape>
>;
