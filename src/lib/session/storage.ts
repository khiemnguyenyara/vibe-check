/**
 * Guest-mode storage. See specs/001-mvp-guest-mode.md §5.
 *
 * Three invariants every accessor here upholds:
 *  1. SSR-safe — these run inside Client Components that Next.js still
 *     renders on the server, so an unguarded `window` reference throws.
 *  2. Never throws — Safari private browsing throws on write and quota
 *     exhaustion throws on large transcripts. Storage failing must never
 *     take down an in-progress interview, so everything degrades to
 *     "no stored data".
 *  3. Validates before trusting — these values are user-writable via
 *     DevTools. Parsed JSON is narrowed from `unknown`, never cast.
 */

import type { PersistedSession, SessionSummary, TranscriptTurn } from "./types";

/** PRD §3: login wall triggers upon completing the 3rd session. */
export const GUEST_SESSION_LIMIT = 3;

/** Unprefixed because the PRD names this key verbatim. */
const COUNT_KEY = "interview_count";
const ACTIVE_SESSION_KEY = "vibe-check:active-session";
const HISTORY_KEY = "vibe-check:session-history";

type Store = "local" | "session";

function getStore(store: Store): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return store === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    // Accessing storage itself can throw when cookies/site-data are blocked.
    return null;
  }
}

function readRaw(store: Store, key: string): unknown {
  const storage = getStore(store);
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

function writeRaw(store: Store, key: string, value: unknown): void {
  const storage = getStore(store);
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or private mode — the interview continues unpersisted.
  }
}

function removeRaw(store: Store, key: string): void {
  const storage = getStore(store);
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    // Nothing actionable; the stale value is overwritten on the next save.
  }
}

/* ------------------------------------------------------------------ */
/* Validators — narrow from unknown (interface-contracts.md §4.2 r.3)  */
/* ------------------------------------------------------------------ */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isTurn(value: unknown): value is TranscriptTurn {
  if (!isRecord(value)) return false;
  const { id, question, answer, evaluation } = value;

  if (typeof id !== "string") return false;
  if (answer !== null && typeof answer !== "string") return false;

  if (!isRecord(question)) return false;
  if (typeof question.id !== "string") return false;
  if (typeof question.prompt !== "string") return false;
  if (typeof question.maxScore !== "number") return false;
  if (!isStringArray(question.expectedKeyPoints)) return false;

  if (evaluation !== null) {
    if (!isRecord(evaluation)) return false;
    if (typeof evaluation.score !== "number") return false;
    if (typeof evaluation.maxScore !== "number") return false;
    if (typeof evaluation.summary !== "string") return false;
    if (!isStringArray(evaluation.strengths)) return false;
    if (!isStringArray(evaluation.knowledgeGaps)) return false;
  }

  return true;
}

function isPersistedSession(value: unknown): value is PersistedSession {
  if (!isRecord(value)) return false;
  const {
    sessionId,
    moduleId,
    specialtyId,
    startedAt,
    completedAt,
    turns,
    pendingAnswer,
    sessionLength,
  } = value;

  return (
    typeof sessionId === "string" &&
    typeof moduleId === "string" &&
    typeof specialtyId === "string" &&
    typeof startedAt === "string" &&
    (completedAt === null || typeof completedAt === "string") &&
    // Tolerated as missing so a session stored by an earlier build still
    // restores instead of being silently discarded mid-interview. Normalized
    // in loadActiveSession rather than rejected here.
    (pendingAnswer === undefined ||
      pendingAnswer === null ||
      typeof pendingAnswer === "string") &&
    (sessionLength === undefined || typeof sessionLength === "number") &&
    Array.isArray(turns) &&
    turns.every(isTurn)
  );
}

function isSessionSummary(value: unknown): value is SessionSummary {
  if (!isRecord(value)) return false;
  const {
    sessionId,
    moduleId,
    specialtyId,
    completedAt,
    totalScore,
    maxScore,
    topGaps,
  } = value;

  return (
    typeof sessionId === "string" &&
    typeof moduleId === "string" &&
    typeof specialtyId === "string" &&
    typeof completedAt === "string" &&
    typeof totalScore === "number" &&
    typeof maxScore === "number" &&
    isStringArray(topGaps)
  );
}

/* ------------------------------------------------------------------ */
/* Active session — sessionStorage (US4)                               */
/* ------------------------------------------------------------------ */

export function loadActiveSession(): PersistedSession | null {
  const parsed = readRaw("session", ACTIVE_SESSION_KEY);
  if (!isPersistedSession(parsed)) {
    // Corrupt or hand-edited — drop it rather than resume from garbage.
    if (parsed !== null) clearActiveSession();
    return null;
  }
  // Normalize fields a previous build may not have written.
  return {
    ...parsed,
    pendingAnswer: parsed.pendingAnswer ?? null,
    sessionLength: parsed.sessionLength ?? 0,
  };
}

export function saveActiveSession(session: PersistedSession): void {
  writeRaw("session", ACTIVE_SESSION_KEY, session);
}

export function clearActiveSession(): void {
  removeRaw("session", ACTIVE_SESSION_KEY);
}

/* ------------------------------------------------------------------ */
/* Guest counter — localStorage                                        */
/* ------------------------------------------------------------------ */

export function readInterviewCount(): number {
  const parsed = readRaw("local", COUNT_KEY);
  // Tolerate the plain-number string an earlier build (or a human) may have
  // written: JSON.parse("3") yields 3, so both encodings land here.
  if (typeof parsed !== "number" || !Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }
  return Math.floor(parsed);
}

export function incrementInterviewCount(): number {
  const next = readInterviewCount() + 1;
  writeRaw("local", COUNT_KEY, next);
  return next;
}

/* ------------------------------------------------------------------ */
/* Completed-session history — localStorage (US3)                      */
/* ------------------------------------------------------------------ */

export function loadHistory(): SessionSummary[] {
  const parsed = readRaw("local", HISTORY_KEY);
  if (!Array.isArray(parsed)) return [];
  // Keep the valid entries rather than discarding the whole history over one
  // bad row — a guest's earlier results are not worth losing to a typo.
  return parsed.filter(isSessionSummary);
}

export function appendHistory(summary: SessionSummary): void {
  writeRaw("local", HISTORY_KEY, [...loadHistory(), summary]);
}
