import type { InterviewQuestion, TranscriptTurn } from "@/lib/session/types";

/**
 * The question currently awaiting an answer — the trailing turn is where
 * use-interview-session appends a fresh question, with `answer`/`evaluation`
 * null until it's answered. No dedicated "current question" state exists in
 * the hook; this is the one derivation every consumer should share.
 */
export function getPendingQuestion(
  turns: readonly TranscriptTurn[]
): InterviewQuestion | null {
  const trailing = turns.at(-1);
  return trailing && trailing.answer === null ? trailing.question : null;
}
