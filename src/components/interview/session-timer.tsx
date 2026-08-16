"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function formatElapsed(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Live "how long has this interview taken" readout. Ticks off `Date.now()`,
 * an environment read that can't run during render without risking a
 * hydration mismatch — same reasoning use-interview-session.ts's bootstrap
 * effect documents for sessionStorage — so it renders nothing until the
 * first effect pass resolves a real value.
 *
 * Freezes once `endedAt` is set (the session completed) rather than
 * continuing to climb past a finished interview, which would read as a
 * bug rather than a feature.
 */
export function SessionTimer({
  startedAt,
  endedAt = null,
}: {
  readonly startedAt: string | null;
  readonly endedAt?: string | null;
}) {
  const [elapsedSeconds, setElapsedSeconds] = useState<number | null>(null);

  // set-state-in-effect is disabled deliberately: Date.now() is an external
  // clock read, the same "subscribe to an external system on mount" case
  // use-interview-session.ts's bootstrap effect documents for sessionStorage
  // — it cannot run during render without desyncing server/client output.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!startedAt) return;
    const startMs = new Date(startedAt).getTime();

    if (endedAt) {
      setElapsedSeconds(
        Math.max(0, Math.floor((new Date(endedAt).getTime() - startMs) / 1000))
      );
      return;
    }

    const tick = () =>
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt, endedAt]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (elapsedSeconds === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold tabular-nums text-muted-foreground">
      <Clock className="size-3.5" aria-hidden />
      {formatElapsed(elapsedSeconds)}
    </span>
  );
}
