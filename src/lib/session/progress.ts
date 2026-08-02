import type { SessionSummary } from "./types";

/**
 * Per-specialty progress rollup — resolves specs/003-ui-ux-blueprint.md §13 Q4.
 *
 * That question noted node state depends on per-specialty history while
 * `SessionSummary` only stores `specialtyId` with no rollup defined. This is
 * the definition. It derives everything from existing stored data, so no
 * storage-schema change and no migration.
 */

/** Best run at ≥ this share of the available points counts as mastered. */
export const MASTERY_THRESHOLD = 0.8;

export interface SpecialtyProgress {
  readonly attempts: number;
  /** Best percentage across attempts, 0–100. */
  readonly bestPercent: number;
  readonly mastered: boolean;
}

/** Keyed `${moduleId}/${specialtyId}` — module ids alone are not unique. */
export type ProgressIndex = ReadonlyMap<string, SpecialtyProgress>;

/** The specialty a returning candidate was last practising. */
export interface CurrentTrack {
  readonly moduleId: string;
  readonly specialtyId: string;
}

export function progressKey(moduleId: string, specialtyId: string): string {
  return `${moduleId}/${specialtyId}`;
}

function percentOf(summary: SessionSummary): number {
  // A session that recorded no gradable turns is 0%, not NaN — the latter
  // renders as "NaN%" and sorts unpredictably.
  return summary.maxScore === 0
    ? 0
    : Math.round((summary.totalScore / summary.maxScore) * 100);
}

/**
 * Fold completed sessions into a per-specialty index.
 *
 * `completed` is intentionally *any* attempt rather than any passing attempt:
 * §6.1 gives `completed` the meaning "done", and demoting a finished-but-weak
 * session back to `available` would erase visible progress, which principle 1
 * exists to prevent and principle 3 makes a punishment.
 */
export function buildProgressIndex(
  history: readonly SessionSummary[]
): ProgressIndex {
  const index = new Map<string, SpecialtyProgress>();

  for (const summary of history) {
    const key = progressKey(summary.moduleId, summary.specialtyId);
    const previous = index.get(key);
    const percent = percentOf(summary);
    const bestPercent = Math.max(previous?.bestPercent ?? 0, percent);

    index.set(key, {
      attempts: (previous?.attempts ?? 0) + 1,
      bestPercent,
      mastered: bestPercent >= MASTERY_THRESHOLD * 100,
    });
  }

  return index;
}

/**
 * The specialty the candidate is currently working on, or null for someone
 * with no history.
 *
 * Null matters. A candidate's profession is theirs, not ours to guess: a
 * frontend engineer practises Frontend, and showing a stranger "continue with
 * Frontend" before they have chosen anything presumes a career for them.
 * Callers must treat null as "let them choose", never as "default to the
 * first entry in the registry".
 */
export function currentTrack(
  history: readonly SessionSummary[]
): CurrentTrack | null {
  // History is append-ordered, so the last entry is the most recent session.
  const latest = history.at(-1);
  return latest
    ? { moduleId: latest.moduleId, specialtyId: latest.specialtyId }
    : null;
}
