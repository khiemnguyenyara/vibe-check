import "server-only";

import type { AnswerEvaluation, InterviewQuestion } from "@/lib/session/types";

/**
 * Deterministic mock scorer. Logic unchanged from the previous client-side
 * mock; it moved server-side so scoring is not client-editable, which
 * specs/002-architecture-and-api-contracts.md §3.1 requires for the feature
 * to be worth anything at all.
 *
 * Determinism is a contract obligation, not an implementation detail —
 * docs/interface-contracts.md §6 makes it a review checklist item. Same
 * question + same answer must always yield the same evaluation, so no
 * Date.now(), no Math.random(), no I/O in here.
 */

/**
 * Words too common to tell a good answer from a bad one. Kept deliberately
 * short: over-filtering strips the technical vocabulary the score depends on.
 * Negations ("không") are NOT stopwords — they carry meaning in key points
 * like "useState trigger re-render, useRef thì không".
 */
const STOP_WORDS = new Set([
  "cac", "cho", "cua", "dan", "den", "duoc", "hay", "hoac", "khi", "mot",
  "nay", "nhu", "nhung", "theo", "thi", "trong", "tren", "tuc", "vao", "voi",
  "and", "are", "for", "from", "into", "that", "the", "then", "this", "with",
]);

/** Shortest token still specific enough to match on ("re" is not). */
const MIN_TOKEN_LENGTH = 3;

/**
 * Share of a key point's significant tokens that must appear in the answer
 * for it to count as covered. Low enough that a paraphrase in the
 * candidate's own words still scores, high enough that an off-topic answer
 * brushing one shared word does not.
 */
const COVERAGE_THRESHOLD = 0.4;

/**
 * Lowercase, strip Vietnamese diacritics, split on anything non-alphanumeric.
 * Diacritic-stripping matters because the question bank is fully accented
 * Vietnamese while candidates routinely type unaccented — "khong" must match
 * "không" or every answer would score near zero.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    // Combining marks left behind by NFD. Escaped rather than literal so the
    // range stays visible in a diff.
    .replace(/[\u0300-\u036f]/g, "")
    // "đ" is its own letter, not a base + mark, so NFD leaves it intact.
    .replace(/đ/g, "d")
    .split(/[^a-z0-9]+/)
    .filter(
      (token) => token.length >= MIN_TOKEN_LENGTH && !STOP_WORDS.has(token)
    );
}

function isCovered(keyPoint: string, answerTokens: ReadonlySet<string>): boolean {
  const pointTokens = tokenize(keyPoint);
  if (pointTokens.length === 0) return false;

  const matched = pointTokens.filter((token) => answerTokens.has(token)).length;
  return matched / pointTokens.length >= COVERAGE_THRESHOLD;
}

/** Verdict band. Mirrors the tone of the bank's own `rubric.criteria`. */
function summarize(ratio: number): string {
  if (ratio >= 0.8) {
    return "Câu trả lời bao quát tốt các ý chính, thể hiện hiểu biết vững về chủ đề.";
  }
  if (ratio >= 0.5) {
    return "Câu trả lời đi đúng hướng nhưng còn bỏ sót một số ý quan trọng.";
  }
  if (ratio >= 0.2) {
    return "Câu trả lời mới chạm tới một phần nhỏ của vấn đề, cần đào sâu thêm.";
  }
  return "Câu trả lời chưa đề cập được các ý chính mà câu hỏi hướng tới.";
}

export function scoreAnswer(
  question: InterviewQuestion,
  answer: string
): AnswerEvaluation {
  const answerTokens = new Set(tokenize(answer));
  const strengths: string[] = [];
  const knowledgeGaps: string[] = [];

  for (const keyPoint of question.expectedKeyPoints) {
    if (isCovered(keyPoint, answerTokens)) {
      strengths.push(keyPoint);
    } else {
      knowledgeGaps.push(keyPoint);
    }
  }

  const total = question.expectedKeyPoints.length;
  const ratio = total === 0 ? 0 : strengths.length / total;

  // Clamped even though the arithmetic cannot exceed maxScore today. §5.3
  // requires the clamp unconditionally once a model produces the score, and
  // a clamp that only appears alongside the model is a clamp someone forgets.
  const score = Math.min(
    Math.max(Math.round(ratio * question.maxScore), 0),
    question.maxScore
  );

  return {
    score,
    maxScore: question.maxScore,
    summary: summarize(ratio),
    strengths,
    knowledgeGaps,
  };
}
