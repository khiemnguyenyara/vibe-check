/**
 * Wire contract for POST /api/v1/interview/turn.
 * Normative source: specs/002-architecture-and-api-contracts.md §8.
 *
 * Imported by BOTH the route handler and the client HTTP adapter — that
 * shared import is the point. One definition means the two ends cannot drift
 * from each other, and the client parsing responses is not redundant
 * ceremony: it is what stops a malformed deploy from putting `undefined`
 * into the render tree (§8.6).
 *
 * Lives in src/lib per docs/hla.md §6 — shared, domain-agnostic, and
 * importing nothing from src/modules.
 */

import { z } from "zod";

import type {
  AnswerEvaluation,
  InterviewQuestion,
  TranscriptTurn,
} from "@/lib/session/types";

/* ------------------------------------------------------------------ */
/* Version (§7)                                                        */
/* ------------------------------------------------------------------ */

/** Echoed on every response as X-Contract-Version. */
export const API_CONTRACT_VERSION = "1.0.0";

export const INTERVIEW_TURN_PATH = "/api/v1/interview/turn";

/* ------------------------------------------------------------------ */
/* Payload budget (§6.1)                                               */
/* ------------------------------------------------------------------ */

/**
 * Statelessness means the transcript is re-uploaded every turn, so payload
 * growth is quadratic across a session. These caps are a correctness
 * requirement, not a nicety — they bound the work a hostile client can
 * demand. Referenced by both the schemas below and the handler's pre-parse
 * body check, so the two can never disagree.
 */
export const LIMITS = {
  maxBodyBytes: 128 * 1024,
  maxTranscriptTurns: 20,
  maxAnswerChars: 8_000,
  maxPromptChars: 2_000,
  maxKeyPoints: 8,
  maxKeyPointChars: 300,
  maxFocusAreas: 5,
  maxSummaryChars: 500,
} as const;

/* ------------------------------------------------------------------ */
/* Shared primitives (§8.1)                                            */
/* ------------------------------------------------------------------ */

export const experienceLevelSchema = z.enum([
  "junior",
  "mid",
  "senior",
  "staff",
]);

/**
 * Only locales with an actual question bank. specs/002 §10 Q2: accepting a
 * locale with no content is a 200 response in the wrong language, which is
 * worse than a rejection. Widening is one line here plus one in
 * src/modules/types.ts, and the drift guard forces both to move together.
 */
export const localeSchema = z.enum(["vi-VN"]);

/** kebab-case, matching the ModuleDefinition.id constraint. */
export const moduleIdSchema = z
  .string()
  .min(1)
  .max(32)
  .regex(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/, "must be kebab-case");

export const specialtyIdSchema = moduleIdSchema;

/** Client-generated (crypto.randomUUID). Correlation only — never identity. */
export const sessionIdSchema = z.string().uuid();

export const idempotencyKeySchema = z.string().uuid();

/* ------------------------------------------------------------------ */
/* Domain shapes (§8.2)                                                */
/* ------------------------------------------------------------------ */

export const interviewQuestionSchema = z.object({
  id: z.string().min(1).max(64),
  prompt: z.string().min(1).max(LIMITS.maxPromptChars),
  expectedKeyPoints: z
    .array(z.string().min(1).max(LIMITS.maxKeyPointChars))
    .min(1)
    .max(LIMITS.maxKeyPoints),
  maxScore: z.number().int().min(1).max(100),
});

export const answerEvaluationSchema = z
  .object({
    score: z.number().int().min(0),
    maxScore: z.number().int().min(1).max(100),
    summary: z.string().min(1).max(LIMITS.maxSummaryChars),
    strengths: z
      .array(z.string().max(LIMITS.maxKeyPointChars))
      .max(LIMITS.maxKeyPoints),
    knowledgeGaps: z
      .array(z.string().max(LIMITS.maxKeyPointChars))
      .max(LIMITS.maxKeyPoints),
  })
  .refine((evaluation) => evaluation.score <= evaluation.maxScore, {
    message: "score must not exceed maxScore",
    path: ["score"],
  });

export const transcriptTurnSchema = z.object({
  id: z.string().min(1).max(64),
  question: interviewQuestionSchema,
  answer: z.string().max(LIMITS.maxAnswerChars).nullable(),
  evaluation: answerEvaluationSchema.nullable(),
});

export const interviewSessionContextSchema = z.object({
  sessionId: sessionIdSchema,
  candidateName: z.string().max(120).optional(),
  experienceLevel: experienceLevelSchema,
  // Empty is valid by design: interface-contracts.md §3.2 rule 2 requires
  // getSystemPrompt to supply a domain default rather than reject.
  focusAreas: z.array(z.string().min(1).max(80)).max(LIMITS.maxFocusAreas),
  locale: localeSchema,
});

/* ------------------------------------------------------------------ */
/* Request (§8.3)                                                      */
/* ------------------------------------------------------------------ */

export const turnRequestSchema = z.object({
  context: interviewSessionContextSchema,
  moduleId: moduleIdSchema,
  specialtyId: specialtyIdSchema,
  /** Answered turns so far. Empty on the opening request. */
  transcript: z.array(transcriptTurnSchema).max(LIMITS.maxTranscriptTurns),
  /** The answer to the trailing transcript turn. Null opens the session. */
  pendingAnswer: z.string().min(1).max(LIMITS.maxAnswerChars).nullable(),
});

export type TurnRequest = z.infer<typeof turnRequestSchema>;

/* ------------------------------------------------------------------ */
/* Response (§8.4)                                                     */
/* ------------------------------------------------------------------ */

export const turnResponseSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("in_progress"),
    /** Null only on the opening request. */
    evaluation: answerEvaluationSchema.nullable(),
    nextQuestion: interviewQuestionSchema,
    turnIndex: z.number().int().min(0),
    sessionLength: z.number().int().min(1).max(LIMITS.maxTranscriptTurns),
  }),
  z.object({
    status: z.literal("completed"),
    evaluation: answerEvaluationSchema,
    sessionLength: z.number().int().min(1).max(LIMITS.maxTranscriptTurns),
  }),
]);

export type TurnResponse = z.infer<typeof turnResponseSchema>;

/* ------------------------------------------------------------------ */
/* Errors (§8.5)                                                       */
/* ------------------------------------------------------------------ */

export const apiErrorCodeSchema = z.enum([
  "INVALID_REQUEST",
  "PAYLOAD_TOO_LARGE",
  "MODULE_NOT_FOUND",
  "RATE_LIMITED",
  "UPSTREAM_UNAVAILABLE",
  "INTERNAL",
]);

export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;

export const apiErrorSchema = z.object({
  error: z.object({
    code: apiErrorCodeSchema,
    /** Safe to display. Never contains transcript content (§5.3). */
    message: z.string().max(300),
    /** Field paths only, never values — see §8.5. */
    details: z.array(z.string().max(120)).max(20).optional(),
  }),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

/** Single source for code → HTTP status, so handler and tests agree. */
export const ERROR_STATUS: Readonly<Record<ApiErrorCode, number>> = {
  INVALID_REQUEST: 400,
  PAYLOAD_TOO_LARGE: 413,
  MODULE_NOT_FOUND: 404,
  RATE_LIMITED: 429,
  UPSTREAM_UNAVAILABLE: 502,
  INTERNAL: 500,
};

/* ------------------------------------------------------------------ */
/* Compile-time drift guard                                            */
/* ------------------------------------------------------------------ */

/**
 * §8.2 requires these schemas to mirror src/lib/session/types.ts exactly and
 * to change in the same commit. A comment cannot enforce that; these do.
 *
 * If a field is added, removed, renamed, or retyped on either side, one of
 * the assertions below stops compiling. The alternative — deriving the types
 * from the schemas with z.infer — was rejected because it would erase the
 * `readonly` modifiers the rest of the codebase relies on and would drag zod
 * into every type-only import site.
 */
type DeepMutable<T> = T extends readonly (infer U)[]
  ? DeepMutable<U>[]
  : T extends object
    ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
    : T;

type Equals<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

type Expect<T extends true> = T;

type _QuestionMatches = Expect<
  Equals<DeepMutable<InterviewQuestion>, z.infer<typeof interviewQuestionSchema>>
>;

type _EvaluationMatches = Expect<
  Equals<DeepMutable<AnswerEvaluation>, z.infer<typeof answerEvaluationSchema>>
>;

type _TurnMatches = Expect<
  Equals<DeepMutable<TranscriptTurn>, z.infer<typeof transcriptTurnSchema>>
>;
