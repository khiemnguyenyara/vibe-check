/**
 * The "Get Started" header popup's answers — a candidate's job/career and
 * why they came by. Stored separately from the guest-progress data in
 * storage.ts: this is intake, not interview progress, and the two rotate on
 * different lifecycles.
 *
 * Same invariants as storage.ts: SSR-safe, never throws, validates before
 * trusting a parsed value.
 */

export type IntakeReason = "interview" | "other";

export interface IntakeProfile {
  readonly role: string;
  readonly reason: IntakeReason;
}

const INTAKE_KEY = "vibe-check:intake-profile";

function isIntakeProfile(value: unknown): value is IntakeProfile {
  if (typeof value !== "object" || value === null) return false;
  const { role, reason } = value as Record<string, unknown>;
  return (
    typeof role === "string" && (reason === "interview" || reason === "other")
  );
}

export function saveIntakeProfile(profile: IntakeProfile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(INTAKE_KEY, JSON.stringify(profile));
  } catch {
    // Quota exceeded or private mode — the popup still routes the user in.
  }
}

export function loadIntakeProfile(): IntakeProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(INTAKE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isIntakeProfile(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
