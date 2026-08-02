import { NextResponse } from "next/server";

import {
  API_CONTRACT_VERSION,
  ERROR_STATUS,
  LIMITS,
  idempotencyKeySchema,
  turnRequestSchema,
  turnResponseSchema,
  type ApiErrorCode,
  type TurnRequest,
  type TurnResponse,
} from "@/lib/api/interview-contract";
import type { InterviewQuestion, TurnOutcome } from "@/lib/session/types";
import { getServerModule } from "@/modules/server-registry";
import type { ServerInterviewModule } from "@/modules/server-types";

/**
 * POST /api/v1/interview/turn — the entire interview loop, one route.
 * specs/002-architecture-and-api-contracts.md §4.1.
 *
 * Stateless by construction: nothing here reads or writes storage, and
 * nothing survives the response. Everything the handler needs arrives in the
 * request or comes from the module registry, which is code.
 *
 * §5.1 classifies the whole request body as untrusted — not "mostly trusted
 * because our own client sent it". Every rule below exists because the same
 * request is trivially reproducible with curl.
 */

/** Node runtime: `server-only` modules and the bank are not edge-portable. */
export const runtime = "nodejs";
/** Never cached — the response depends entirely on a POST body. */
export const dynamic = "force-dynamic";

function errorResponse(
  code: ApiErrorCode,
  message: string,
  details?: string[]
): NextResponse {
  return NextResponse.json(
    { error: { code, message, ...(details ? { details } : {}) } },
    {
      status: ERROR_STATUS[code],
      headers: { "X-Contract-Version": API_CONTRACT_VERSION },
    }
  );
}

function okResponse(payload: TurnResponse): NextResponse {
  return NextResponse.json(payload, {
    status: 200,
    headers: { "X-Contract-Version": API_CONTRACT_VERSION },
  });
}

/**
 * §6.5 — structured, and deliberately incapable of carrying content.
 * Only scalars the caller cannot inject free text into are accepted, so an
 * answer or a question body cannot reach the log by accident later.
 */
function logTurn(fields: {
  outcome: string;
  moduleId?: string;
  specialtyId?: string;
  turnIndex?: number;
  sessionLength?: number;
  durationMs: number;
}): void {
  console.info(JSON.stringify({ route: "interview.turn", ...fields }));
}

/**
 * §8.3 cross-field rules. Zod cannot express these — the first needs the
 * relationship between two fields, the second needs the trailing element's
 * shape. Returned as field paths, never values (§8.5).
 */
function checkCrossFieldRules(request: TurnRequest): string[] | null {
  const { transcript, pendingAnswer } = request;

  if (pendingAnswer === null) {
    return transcript.length === 0 ? null : ["transcript"];
  }

  const trailing = transcript.at(-1);
  if (!trailing) return null; // First answer with an empty transcript is fine.

  // A transcript whose last turn is already answered means the client lost a
  // response. Rejected rather than silently repaired: silent repair would
  // mask a real client defect and make the bug unfindable.
  return trailing.answer === null ? null : ["transcript"];
}

/**
 * §5.2, the load-bearing rule. The client sends question content back in the
 * transcript; the server grades only against its own copy, re-resolved by id.
 * Without this the scoring feature is decorative — a candidate could post a
 * question with one trivially-matched key point and award themselves 10/10.
 */
async function resolveGradableQuestion(
  serverModule: ServerInterviewModule,
  request: TurnRequest
): Promise<InterviewQuestion | null> {
  const trailing = request.transcript.at(-1);
  if (trailing) return serverModule.resolveQuestion(trailing.question.id);

  // No transcript but an answer present: the client answered the opening
  // question without echoing it back. Re-derive turn 0 from the bank.
  return serverModule.selectQuestion(request.context, 0);
}

export async function POST(req: Request): Promise<NextResponse> {
  const startedAt = performance.now();
  const elapsed = () => Math.round(performance.now() - startedAt);

  // --- Idempotency key (§6.3) ------------------------------------------
  // Advisory today: with no store the server cannot deduplicate. Required
  // now so clients build the discipline before the server can enforce it.
  const idempotencyKey = req.headers.get("Idempotency-Key");
  if (!idempotencyKeySchema.safeParse(idempotencyKey).success) {
    logTurn({ outcome: "INVALID_REQUEST.idempotency", durationMs: elapsed() });
    return errorResponse(
      "INVALID_REQUEST",
      "Idempotency-Key header must be a UUID.",
      ["header:Idempotency-Key"]
    );
  }

  // --- Payload budget (§6.1) -------------------------------------------
  // Checked against actual bytes, before parsing. Content-Length alone is
  // client-supplied and therefore not evidence of anything (§5.1).
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    logTurn({ outcome: "INVALID_REQUEST.unreadable", durationMs: elapsed() });
    return errorResponse("INVALID_REQUEST", "Request body could not be read.");
  }

  if (new TextEncoder().encode(raw).length > LIMITS.maxBodyBytes) {
    logTurn({ outcome: "PAYLOAD_TOO_LARGE", durationMs: elapsed() });
    return errorResponse(
      "PAYLOAD_TOO_LARGE",
      `Request body exceeds ${LIMITS.maxBodyBytes} bytes.`
    );
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    logTurn({ outcome: "INVALID_REQUEST.json", durationMs: elapsed() });
    return errorResponse("INVALID_REQUEST", "Request body is not valid JSON.");
  }

  // --- Schema validation (§8.6) ----------------------------------------
  const parsed = turnRequestSchema.safeParse(parsedJson);
  if (!parsed.success) {
    logTurn({ outcome: "INVALID_REQUEST.schema", durationMs: elapsed() });
    return errorResponse(
      "INVALID_REQUEST",
      "Request failed schema validation.",
      // Paths only. Echoing rejected values back would make validation
      // errors a reflection vector and would put answer text in monitoring.
      parsed.error.issues.map((issue) => issue.path.join(".")).slice(0, 20)
    );
  }
  const request = parsed.data;

  const crossFieldViolations = checkCrossFieldRules(request);
  if (crossFieldViolations) {
    logTurn({
      outcome: "INVALID_REQUEST.crossField",
      moduleId: request.moduleId,
      specialtyId: request.specialtyId,
      durationMs: elapsed(),
    });
    return errorResponse(
      "INVALID_REQUEST",
      "Transcript and pendingAnswer are inconsistent.",
      crossFieldViolations
    );
  }

  // --- Module resolution ------------------------------------------------
  const serverModule = getServerModule(request.moduleId);
  if (!serverModule) {
    logTurn({
      outcome: "MODULE_NOT_FOUND",
      moduleId: request.moduleId,
      specialtyId: request.specialtyId,
      durationMs: elapsed(),
    });
    return errorResponse(
      "MODULE_NOT_FOUND",
      "This domain does not have an interview service."
    );
  }

  const { sessionLength } = serverModule;

  try {
    // --- Opening request ------------------------------------------------
    if (request.pendingAnswer === null) {
      const question = await serverModule.selectQuestion(request.context, 0);
      if (!question) {
        logTurn({
          outcome: "INTERNAL.noOpeningQuestion",
          moduleId: request.moduleId,
          durationMs: elapsed(),
        });
        return errorResponse("INTERNAL", "No opening question available.");
      }

      return finalize(
        {
          status: "in_progress",
          evaluation: null,
          nextQuestion: question,
          turnIndex: 0,
          sessionLength,
        },
        request,
        elapsed
      );
    }

    // --- Grade the pending answer ---------------------------------------
    const gradable = await resolveGradableQuestion(serverModule, request);
    if (!gradable) {
      logTurn({
        outcome: "INVALID_REQUEST.unknownQuestion",
        moduleId: request.moduleId,
        durationMs: elapsed(),
      });
      return errorResponse(
        "INVALID_REQUEST",
        "The question being answered is not recognized.",
        ["transcript.question.id"]
      );
    }

    const evaluation = await serverModule.evaluate(
      gradable,
      request.pendingAnswer,
      request.context
    );

    // --- Derived, never accepted (§5.2) ----------------------------------
    // How many turns are answered once this one lands, computed from the
    // transcript rather than from anything the client asserts. The cross-field
    // rule guarantees the trailing turn is the unanswered one, so its length
    // already counts the turn being graded; an empty transcript means the
    // client answered the opening question without echoing it back.
    const answeredTurns = Math.max(request.transcript.length, 1);

    // --- Completion, derived ---------------------------------------------
    if (answeredTurns >= sessionLength) {
      return finalize(
        { status: "completed", evaluation, sessionLength },
        request,
        elapsed
      );
    }

    const nextQuestion = await serverModule.selectQuestion(
      request.context,
      answeredTurns
    );
    if (!nextQuestion) {
      // Bank exhausted before sessionLength — treat as completion rather
      // than erroring, so a short bank degrades instead of trapping the user.
      return finalize(
        { status: "completed", evaluation, sessionLength },
        request,
        elapsed
      );
    }

    return finalize(
      {
        status: "in_progress",
        evaluation,
        nextQuestion,
        turnIndex: answeredTurns,
        sessionLength,
      },
      request,
      elapsed
    );
  } catch {
    // Nothing is logged from the error itself: a thrown provider error can
    // carry prompt or answer text in its message (§5.3).
    logTurn({
      outcome: "INTERNAL",
      moduleId: request.moduleId,
      specialtyId: request.specialtyId,
      durationMs: elapsed(),
    });
    return errorResponse("INTERNAL", "Unable to process this turn.");
  }
}

/**
 * §8.6 — validate on the way out too. This looks redundant while the handler
 * constructs the object itself, and it is not: it is the check that catches a
 * model-backed scorer returning a malformed evaluation, and it is what makes
 * §5.3's injection mitigation actually hold. A hijacked response fails
 * parsing here instead of reaching the render tree.
 */
function finalize(
  payload: TurnOutcome,
  request: TurnRequest,
  elapsed: () => number
): NextResponse {
  const validated = turnResponseSchema.safeParse(payload);
  if (!validated.success) {
    logTurn({
      outcome: "INTERNAL.responseSchema",
      moduleId: request.moduleId,
      durationMs: elapsed(),
    });
    return errorResponse("INTERNAL", "Generated an invalid response.");
  }

  logTurn({
    outcome: validated.data.status,
    moduleId: request.moduleId,
    specialtyId: request.specialtyId,
    turnIndex:
      validated.data.status === "in_progress"
        ? validated.data.turnIndex
        : undefined,
    sessionLength: validated.data.sessionLength,
    durationMs: elapsed(),
  });

  return okResponse(validated.data);
}
