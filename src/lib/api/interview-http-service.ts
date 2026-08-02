"use client";

import {
  API_CONTRACT_VERSION,
  INTERVIEW_TURN_PATH,
  apiErrorSchema,
  turnResponseSchema,
  type ApiErrorCode,
} from "./interview-contract";
import type { TurnOutcome, TurnSubmission } from "@/lib/session/types";

/**
 * The client half of specs/002-architecture-and-api-contracts.md.
 *
 * Deliberately domain-agnostic: `moduleId` travels in the request body, so
 * every module shares this one instance rather than each shipping its own
 * adapter. A module's registry entry still decides *whether* it has a
 * service — that presence check is what produces the "unavailable" state for
 * modules like `marketing` — but not *how* it talks.
 *
 * It holds no state between calls. That is not incidental: a stateful
 * adapter accumulating its own transcript would break session restore, where
 * the engine has history the adapter never saw.
 */

/** Thrown for any non-success turn. `code` drives the UI's retry decision. */
export class InterviewApiError extends Error {
  readonly code: ApiErrorCode | "CONTRACT_MISMATCH" | "NETWORK";

  constructor(
    code: ApiErrorCode | "CONTRACT_MISMATCH" | "NETWORK",
    message: string
  ) {
    super(message);
    this.name = "InterviewApiError";
    this.code = code;
  }
}

async function postTurn(input: TurnSubmission): Promise<TurnOutcome> {
  let response: Response;
  try {
    response = await fetch(INTERVIEW_TURN_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // §6.3 — a fresh key per logical turn. Advisory server-side today;
        // generated here so the discipline exists before enforcement does.
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        context: input.context,
        moduleId: input.moduleId,
        specialtyId: input.specialtyId,
        transcript: input.transcript,
        pendingAnswer: input.pendingAnswer,
      }),
    });
  } catch {
    throw new InterviewApiError("NETWORK", "Không thể kết nối tới máy chủ.");
  }

  // §7 — a client left open across a deploy can meet a contract it does not
  // understand. Detect it rather than parse optimistically and render garbage.
  const serverVersion = response.headers.get("X-Contract-Version");
  if (serverVersion && serverVersion !== API_CONTRACT_VERSION) {
    throw new InterviewApiError(
      "CONTRACT_MISMATCH",
      "Ứng dụng đã có phiên bản mới. Vui lòng tải lại trang."
    );
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new InterviewApiError("INTERNAL", "Máy chủ trả về dữ liệu không hợp lệ.");
  }

  if (!response.ok) {
    const parsedError = apiErrorSchema.safeParse(body);
    throw new InterviewApiError(
      parsedError.success ? parsedError.data.error.code : "INTERNAL",
      parsedError.success
        ? parsedError.data.error.message
        : "Máy chủ trả về lỗi không xác định."
    );
  }

  // §8.6 — validating a response we "know" the shape of is not redundant.
  // It is what stops a malformed deploy, or a hijacked model output, from
  // reaching the render tree as `undefined`.
  const parsed = turnResponseSchema.safeParse(body);
  if (!parsed.success) {
    throw new InterviewApiError(
      "CONTRACT_MISMATCH",
      "Phản hồi từ máy chủ không đúng định dạng."
    );
  }

  return parsed.data;
}

/**
 * Structurally satisfies `InterviewService` without importing it — naming the
 * interface here would mean lib importing modules, which docs/hla.md §6
 * forbids. The compatibility check happens where it is assigned, in each
 * module's registry entry.
 */
export const httpInterviewService = {
  submitTurn: postTurn,
};
