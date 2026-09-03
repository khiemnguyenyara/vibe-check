import "server-only";

import type { AnswerEvaluation, InterviewQuestion } from "@/lib/session/types";

import type { InterviewSessionContext, Locale } from "./types";

/**
 * The server-side half of a domain module: the content and grading criteria
 * that specs/002-architecture-and-api-contracts.md §3.1 places on the server.
 *
 * This is deliberately a SEPARATE contract from `ModuleDefinition`, not extra
 * fields on it. `ModuleDefinition` is imported by client components; anything
 * added there is reachable from the browser bundle, which would defeat the
 * whole reason the bank moved. Two contracts, two audiences, one registry
 * boundary each.
 *
 * Both methods are async even though the current mock is synchronous. A
 * model-backed implementation will be async, and widening a sync signature
 * later would ripple through the route handler — the cost of the Promise
 * today is zero and it buys a free swap tomorrow.
 */
export interface ServerInterviewModule {
  readonly id: string;

  /** How many questions one session contains. Authoritative (§10 Q1). */
  readonly sessionLength: number;

  /**
   * The question for `turnIndex`. Returns null when the index is out of
   * range — the handler treats that as a completed session rather than an
   * error, since the client legitimately reaches the end.
   *
   * `specialtyId` is the specialty the candidate picked (a `Specialty.id`
   * from src/lib/domains.ts), forwarded verbatim from the request. It is
   * optional per the additive rule in docs/interface-contracts.md §5, so a
   * module that serves one bank for its whole domain simply ignores the
   * parameter and keeps compiling.
   *
   * It is a separate parameter rather than a field on `InterviewSessionContext`
   * because that context is the prompt-builder's input and crosses the wire
   * under `interviewSessionContextSchema`; adding a field there would ripple
   * through the drift guards in src/modules/types.ts and change the request
   * shape for a value the request already carries at the top level.
   *
   * Treat it as untrusted (specs/002 §5.1): it is a validated kebab-case
   * string, not a promise that any such specialty exists. An unrecognized
   * value must degrade — this module's repository falls back to a general
   * bank — never throw.
   */
  selectQuestion(
    context: InterviewSessionContext,
    turnIndex: number,
    specialtyId?: string
  ): Promise<InterviewQuestion | null>;

  /**
   * Re-resolve a question by id from the server's own bank.
   *
   * This exists to enforce §5.2's load-bearing rule: the client sends
   * question content back in the transcript, and the server must never grade
   * against it. Without this, a candidate could post a question carrying one
   * trivially-matched key point and score themselves full marks.
   *
   * `locale` is optional per docs/interface-contracts.md §5, but callers that
   * have one should pass it: a module with localized content grades an open
   * answer by key-point coverage, and re-resolving in the wrong language
   * compares the candidate's words against a translation of the rubric they
   * never saw. Omitting it falls back to the module's authoring default.
   */
  resolveQuestion(
    questionId: string,
    locale?: Locale
  ): Promise<InterviewQuestion | null>;

  /** Grade an answer. Must be deterministic (interface-contracts.md §6). */
  evaluate(
    question: InterviewQuestion,
    answer: string,
    context: InterviewSessionContext
  ): Promise<AnswerEvaluation>;
}
