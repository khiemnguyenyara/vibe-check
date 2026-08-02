import "server-only";

import type { InterviewQuestion } from "@/lib/session/types";

import type { ServerInterviewModule } from "../../server-types";
import type { ExperienceLevel } from "../../types";
import { QUESTION_BANK, TECH_SESSION_LENGTH, type QuestionBankEntry } from "./question-bank";
import { scoreAnswer } from "./scorer";

/**
 * Mock-only pacing. The scorer and bank lookup are instant, so without this
 * the "AI is thinking" affordance never renders long enough to read and the
 * UI flickers. Delete it the moment a real model supplies natural latency —
 * it is simulation, and simulation that outlives its purpose becomes a bug.
 */
const MOCK_LATENCY_MS = 700;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Question ids are `${level}-${index}` so they stay stable across requests
 * and deploys. Stability matters twice: a restored session must match a
 * persisted turn back to its question, and §5.2 re-resolution needs an id
 * that means the same thing on every instance.
 */
function questionId(level: ExperienceLevel, index: number): string {
  return `${level}-${index}`;
}

function toQuestion(
  entry: QuestionBankEntry,
  level: ExperienceLevel,
  index: number
): InterviewQuestion {
  return {
    id: questionId(level, index),
    prompt: entry.question,
    expectedKeyPoints: entry.expectedKeyPoints,
    maxScore: entry.rubric.maxScore,
  };
}

function parseQuestionId(
  id: string
): { level: ExperienceLevel; index: number } | null {
  const separator = id.lastIndexOf("-");
  if (separator <= 0) return null;

  const level = id.slice(0, separator);
  const index = Number(id.slice(separator + 1));

  if (!Object.hasOwn(QUESTION_BANK, level)) return null;
  if (!Number.isInteger(index) || index < 0) return null;

  const bank = QUESTION_BANK[level as ExperienceLevel];
  if (index >= bank.length) return null;

  return { level: level as ExperienceLevel, index };
}

export const techServerModule: ServerInterviewModule = {
  id: "tech",
  sessionLength: TECH_SESSION_LENGTH,

  async selectQuestion(context, turnIndex) {
    if (turnIndex < 0 || turnIndex >= TECH_SESSION_LENGTH) return null;

    await delay(MOCK_LATENCY_MS);

    const level = context.experienceLevel;
    const bank = QUESTION_BANK[level];
    // The bank is shorter than a session, so questions cycle. A real
    // implementation would draw without replacement across a larger pool.
    const index = turnIndex % bank.length;
    return toQuestion(bank[index], level, index);
  },

  async resolveQuestion(id) {
    const parsed = parseQuestionId(id);
    if (!parsed) return null;
    return toQuestion(
      QUESTION_BANK[parsed.level][parsed.index],
      parsed.level,
      parsed.index
    );
  },

  async evaluate(question, answer) {
    return scoreAnswer(question, answer);
  },
};
