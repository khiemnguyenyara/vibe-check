"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  appendHistory,
  clearActiveSession,
  loadActiveSession,
  loadHistory,
  saveActiveSession,
} from "@/lib/session/storage";
import type {
  PersistedSession,
  SessionSummary,
  TranscriptTurn,
} from "@/lib/session/types";
import type {
  InterviewService,
  InterviewSessionContext,
  SessionStatus,
} from "@/modules/types";

/**
 * The Core Session Engine (docs/hla.md §3). Owns the conversation loop,
 * SessionStatus, and persistence — all of which
 * docs/interface-contracts.md §4.2 forbids a domain Workspace from owning.
 *
 * The service arrives by injection from the route, which resolved it through
 * the registry, so this file never imports a concrete domain. Since
 * specs/002, that service is an HTTP adapter: grading and question selection
 * happen server-side and one call covers a whole turn.
 *
 * Lives in src/components/ rather than src/lib/ because it must reference
 * the module contract types; src/lib may not import src/modules (hla.md §6).
 */

interface UseInterviewSessionArgs {
  readonly context: InterviewSessionContext;
  readonly moduleId: string;
  readonly specialtyId: string;
  readonly service: InterviewService | undefined;
}

/** What the engine is currently waiting on, if anything. */
type Pending = "opening" | "turn" | null;

export interface InterviewSessionState {
  readonly turns: readonly TranscriptTurn[];
  readonly status: SessionStatus;
  readonly isFetchingNext: boolean;
  readonly isEvaluating: boolean;
  readonly error: string | null;
  /** Authoritative, from the server. 0 until the first response lands. */
  readonly sessionLength: number;
  readonly summary: SessionSummary | null;
  /** Submitted, awaiting a verdict — rendered optimistically by the chat. */
  readonly pendingAnswer: string | null;
  /** When this session started — null until the bootstrap effect resolves. */
  readonly startedAt: string | null;
  submitAnswer: (answer: string) => Promise<void>;
  /** Re-send the last failed turn. Byte-identical to the original request. */
  retry: () => Promise<void>;
}

/** The three gaps a candidate missed most often, for the summary screen. */
function collectTopGaps(turns: readonly TranscriptTurn[]): string[] {
  const frequency = new Map<string, number>();
  for (const turn of turns) {
    for (const gap of turn.evaluation?.knowledgeGaps ?? []) {
      frequency.set(gap, (frequency.get(gap) ?? 0) + 1);
    }
  }
  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([gap]) => gap);
}

function buildSummary(
  session: PersistedSession,
  completedAt: string
): SessionSummary {
  const graded = session.turns.filter((turn) => turn.evaluation !== null);
  return {
    sessionId: session.sessionId,
    moduleId: session.moduleId,
    specialtyId: session.specialtyId,
    completedAt,
    totalScore: graded.reduce(
      (sum, turn) => sum + (turn.evaluation?.score ?? 0),
      0
    ),
    maxScore: graded.reduce(
      (sum, turn) => sum + (turn.evaluation?.maxScore ?? 0),
      0
    ),
    topGaps: collectTopGaps(session.turns),
  };
}

export function useInterviewSession({
  context,
  moduleId,
  specialtyId,
  service,
}: UseInterviewSessionArgs): InterviewSessionState {
  const [session, setSession] = useState<PersistedSession | null>(null);
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [pending, setPending] = useState<Pending>(null);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SessionSummary | null>(null);

  /** Single write point, so no transcript mutation can skip persistence. */
  const commit = useCallback((next: PersistedSession) => {
    setSession(next);
    saveActiveSession(next);
  }, []);

  const completeSession = useCallback((finished: PersistedSession) => {
    const completedAt = new Date().toISOString();
    const built = buildSummary(finished, completedAt);

    // Idempotency guard: without it, a refresh on the summary screen would
    // re-append a duplicate history entry.
    const alreadyRecorded = loadHistory().some(
      (entry) => entry.sessionId === finished.sessionId
    );
    if (!alreadyRecorded) appendHistory(built);

    clearActiveSession();
    setSession({ ...finished, completedAt, pendingAnswer: null });
    setSummary(built);
    setStatus("completed");
  }, []);

  /**
   * One turn, one round trip. `pendingAnswer` is null for the opening
   * request and set for every subsequent turn.
   *
   * The answer is deliberately NOT written into the trailing turn before the
   * call. Doing so would make that turn look answered, and a retry would then
   * send a transcript the server rejects under the §8.3 cross-field rule.
   * It rides in `current.pendingAnswer` instead, so a retry — including one
   * after a refresh — replays a byte-identical request.
   */
  const submitTurn = useCallback(
    async (current: PersistedSession): Promise<void> => {
      if (!service) return;

      setPending(current.pendingAnswer === null ? "opening" : "turn");
      setError(null);

      try {
        const outcome = await service.submitTurn({
          // The engine owns the real session id; the caller's `context`
          // carries a placeholder because InterviewSessionContext requires
          // the field for getSystemPrompt, which never sees a UUID. Sending
          // the placeholder would fail the wire schema, and would also make
          // §6.5 log correlation useless — every session would share an id.
          context: { ...context, sessionId: current.sessionId },
          moduleId,
          specialtyId,
          transcript: current.turns,
          pendingAnswer: current.pendingAnswer,
        });

        // Fold the graded answer into the trailing turn, if there was one.
        const gradedTurns: TranscriptTurn[] =
          current.pendingAnswer === null
            ? [...current.turns]
            : current.turns.map((turn, index) =>
                index === current.turns.length - 1
                  ? {
                      ...turn,
                      answer: current.pendingAnswer,
                      evaluation: outcome.evaluation,
                    }
                  : turn
              );

        if (outcome.status === "completed") {
          completeSession({
            ...current,
            turns: gradedTurns,
            pendingAnswer: null,
            sessionLength: outcome.sessionLength,
          });
          return;
        }

        commit({
          ...current,
          sessionLength: outcome.sessionLength,
          pendingAnswer: null,
          turns: [
            ...gradedTurns,
            {
              id: `turn-${gradedTurns.length}`,
              question: outcome.nextQuestion,
              answer: null,
              evaluation: null,
            },
          ],
        });
      } catch (caught) {
        // Nothing advanced: the transcript is unchanged and pendingAnswer is
        // preserved, so retry() replays exactly the same request. This is
        // what makes specs/002 §6.2's "a failed turn is resumable" true
        // rather than aspirational.
        setError(
          caught instanceof Error && caught.message
            ? caught.message
            : "Không thể xử lý lượt này. Vui lòng thử lại."
        );
        commit(current);
      } finally {
        setPending(null);
      }
    },
    [service, context, moduleId, specialtyId, commit, completeSession]
  );

  /* ---------------------------------------------------------------- */
  /* Bootstrap: restore from sessionStorage, or start fresh            */
  /* ---------------------------------------------------------------- */

  // Guards React StrictMode's double-invoked effect in development from
  // starting two sessions and opening the interview twice.
  const bootstrapped = useRef(false);

  // set-state-in-effect is disabled for this block deliberately: reading
  // browser storage IS the "subscribe to an external system on mount" case
  // the rule carves out for, and the read cannot move into render without
  // desyncing hydration (the server has no sessionStorage). The guard above
  // keeps it to a single pass, so there is no cascading-render risk.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (bootstrapped.current || !service) return;
    bootstrapped.current = true;

    setStatus("in_progress");

    const stored = loadActiveSession();
    const isResumable =
      stored !== null &&
      stored.moduleId === moduleId &&
      stored.specialtyId === specialtyId &&
      stored.completedAt === null &&
      stored.turns.length > 0;

    if (isResumable) {
      setSession(stored);
      // An answer was in flight when the tab closed — finish that turn.
      if (stored.pendingAnswer !== null) void submitTurn(stored);
      return;
    }

    void submitTurn({
      sessionId: crypto.randomUUID(),
      moduleId,
      specialtyId,
      startedAt: new Date().toISOString(),
      completedAt: null,
      turns: [],
      pendingAnswer: null,
      sessionLength: 0,
      experienceLevel: context.experienceLevel,
    });
  }, [moduleId, specialtyId, service, submitTurn, context.experienceLevel]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* ---------------------------------------------------------------- */
  /* Answer submission                                                 */
  /* ---------------------------------------------------------------- */

  const submitAnswer = useCallback(
    async (answer: string): Promise<void> => {
      const trimmed = answer.trim();
      if (!session || !trimmed || status !== "in_progress" || pending) return;

      const trailing = session.turns.at(-1);
      if (!trailing || trailing.answer !== null) return;

      await submitTurn({ ...session, pendingAnswer: trimmed });
    },
    [session, status, pending, submitTurn]
  );

  const retry = useCallback(async (): Promise<void> => {
    if (!session || pending) return;
    await submitTurn(session);
  }, [session, pending, submitTurn]);

  return {
    turns: session?.turns ?? [],
    status,
    isFetchingNext: pending === "opening",
    isEvaluating: pending === "turn",
    error,
    sessionLength: session?.sessionLength ?? 0,
    summary,
    pendingAnswer: session?.pendingAnswer ?? null,
    startedAt: session?.startedAt ?? null,
    submitAnswer,
    retry,
  };
}
