"use client";

import { ArrowLeft } from "lucide-react";

import { SessionTimer } from "./session-timer";

/**
 * The one piece of chrome the interview route keeps — exit and elapsed
 * time, always in the same place regardless of which screen (active chat,
 * summary, unavailable-domain) is showing underneath. Everything else
 * (site nav, footer) was cut: the interview is the one thing on screen,
 * not a page with an interview embedded in it.
 */
export function InterviewSessionBar({
  label,
  startedAt = null,
  endedAt = null,
  onExit,
}: {
  /** Shown only where the screen below has no title of its own
   * (e.g. the unavailable-domain state) — the active chat already
   * carries the specialty name in its own header. */
  readonly label?: string;
  readonly startedAt?: string | null;
  readonly endedAt?: string | null;
  readonly onExit: () => void;
}) {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-quest-surface-border bg-background px-3 sm:px-4">
      <button
        type="button"
        onClick={onExit}
        className="flex items-center gap-1.5 rounded-full py-1.5 pl-1.5 pr-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Thoát
      </button>

      {label && (
        <span className="truncate text-sm font-semibold text-foreground">
          {label}
        </span>
      )}

      <SessionTimer startedAt={startedAt} endedAt={endedAt} />
    </div>
  );
}
