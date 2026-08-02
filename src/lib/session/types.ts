/**
 * Core-owned session shapes. See specs/001-mvp-guest-mode.md §4.1.
 *
 * Deliberately free of any import from src/modules — docs/hla.md §6 forbids
 * src/lib depending on modules. Domain modules import THIS file (allowed by
 * the same table), never the reverse. That direction is what keeps
 * InterviewService in src/modules/types.ts free of a cycle.
 */

/** Result of grading one answer. `knowledgeGaps` is US2's gap analysis. */
export interface AnswerEvaluation {
  readonly score: number;
  readonly maxScore: number;
  /** One-or-two sentence qualitative verdict shown above the breakdown. */
  readonly summary: string;
  /** Expected key points the answer covered. */
  readonly strengths: readonly string[];
  /** Expected key points the answer missed. */
  readonly knowledgeGaps: readonly string[];
}

/** A question as Core sees it — domain-neutral. */
export interface InterviewQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly expectedKeyPoints: readonly string[];
  readonly maxScore: number;
}

/** One question/answer exchange. `answer`/`evaluation` are null until answered. */
export interface TranscriptTurn {
  readonly id: string;
  readonly question: InterviewQuestion;
  readonly answer: string | null;
  readonly evaluation: AnswerEvaluation | null;
}

/** The in-flight session, mirrored into sessionStorage after every turn (US4). */
export interface PersistedSession {
  readonly sessionId: string;
  /** ModuleDefinition.id — permanently stable, see interface-contracts.md §2. */
  readonly moduleId: string;
  readonly specialtyId: string;
  readonly startedAt: string;
  readonly completedAt: string | null;
  readonly turns: readonly TranscriptTurn[];
  /**
   * An answer submitted but not yet graded, held OUTSIDE `turns` on purpose.
   *
   * Folding it into the trailing turn would make that turn look answered, and
   * a retry would then send a transcript the server rejects under the §8.3
   * cross-field rule. Keeping it separate means a retry — even one after a
   * refresh — replays a byte-identical request.
   */
  readonly pendingAnswer: string | null;
  /**
   * Authoritative session length as reported by the server (specs/002 §10 Q1).
   * Persisted so a restored session can render its progress counter before
   * the next response arrives.
   */
  readonly sessionLength: number;
}

/** A finished session, appended to localStorage history (US3). */
export interface SessionSummary {
  readonly sessionId: string;
  readonly moduleId: string;
  readonly specialtyId: string;
  readonly completedAt: string;
  readonly totalScore: number;
  readonly maxScore: number;
  /** Most frequent unmet key points across the session. */
  readonly topGaps: readonly string[];
}

/**
 * One interview turn crossing the client/server boundary.
 *
 * These live in lib rather than src/modules because both the Core session
 * engine AND the transport in src/lib/api need them, and docs/hla.md §6
 * forbids lib importing from modules. src/modules/types.ts imports them back
 * to express `InterviewService` — that direction is the legal one.
 */
export interface TurnSubmission {
  readonly context: InterviewSessionContextShape;
  readonly moduleId: string;
  readonly specialtyId: string;
  readonly transcript: readonly TranscriptTurn[];
  /** Null opens the session; otherwise the answer to the trailing turn. */
  readonly pendingAnswer: string | null;
}

/**
 * Structural mirror of InterviewSessionContext, declared here so lib can name
 * the shape without importing the module contract. src/modules/types.ts
 * asserts at compile time that the two stay identical.
 */
export interface InterviewSessionContextShape {
  readonly sessionId: string;
  readonly candidateName?: string;
  readonly experienceLevel: "junior" | "mid" | "senior" | "staff";
  readonly focusAreas: readonly string[];
  readonly locale: "vi-VN";
}

/**
 * Mirrors the wire response. `sessionLength` is authoritative here rather
 * than a client-side constant (specs/002 §10 Q1), so a module can vary
 * session length without the UI hard-coding an assumption about it.
 */
export type TurnOutcome =
  | {
      readonly status: "in_progress";
      readonly evaluation: AnswerEvaluation | null;
      readonly nextQuestion: InterviewQuestion;
      readonly turnIndex: number;
      readonly sessionLength: number;
    }
  | {
      readonly status: "completed";
      readonly evaluation: AnswerEvaluation;
      readonly sessionLength: number;
    };
