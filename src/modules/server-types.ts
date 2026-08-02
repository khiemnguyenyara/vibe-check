import "server-only";

import type { AnswerEvaluation, InterviewQuestion } from "@/lib/session/types";

import type { InterviewSessionContext } from "./types";

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
   */
  selectQuestion(
    context: InterviewSessionContext,
    turnIndex: number
  ): Promise<InterviewQuestion | null>;

  /**
   * Re-resolve a question by id from the server's own bank.
   *
   * This exists to enforce §5.2's load-bearing rule: the client sends
   * question content back in the transcript, and the server must never grade
   * against it. Without this, a candidate could post a question carrying one
   * trivially-matched key point and score themselves full marks.
   */
  resolveQuestion(questionId: string): Promise<InterviewQuestion | null>;

  /** Grade an answer. Must be deterministic (interface-contracts.md §6). */
  evaluate(
    question: InterviewQuestion,
    answer: string,
    context: InterviewSessionContext
  ): Promise<AnswerEvaluation>;
}
