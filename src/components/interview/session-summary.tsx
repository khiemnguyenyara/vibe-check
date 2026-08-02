"use client";

import { useEffect, useState } from "react";
import {
  Minus,
  RotateCcw,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { Mascot } from "@/components/mascot/mascot";
import { ActionBubble } from "@/components/ui/action-bubble";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  DURATION,
  EASE,
  SESSION_COMPLETE,
  SPRING,
  STAGGER,
  riseVariants,
} from "@/lib/motion/tokens";
import { loadHistory } from "@/lib/session/storage";
import type {
  SessionSummary as SessionSummaryData,
  TranscriptTurn,
} from "@/lib/session/types";

/**
 * The result screen — US3's only surface, choreographed per
 * specs/003-ui-ux-blueprint.md §8.3 (`session.complete`) and §10.3.
 *
 * The delta is the hero element, not the raw score, and it lands *after* the
 * score with the strongest motion. That ordering is principle 4 made
 * physical: returning matters more than the number.
 */

interface SessionSummaryProps {
  readonly summary: SessionSummaryData;
  readonly turns: readonly TranscriptTurn[];
  readonly specialtyLabel: string;
  readonly onRestart: () => void;
  readonly onHome: () => void;
}

/** Percent, so sessions with different maxScore totals stay comparable. */
function toPercent(score: number, maxScore: number): number {
  return maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);
}

/**
 * §8.4 — count up to the final value, decelerating, and **never down**: a
 * descending number reads as losing something you had.
 *
 * Under reduced motion the final value renders immediately. The element is
 * not an aria-live region — §11 requires the score be announced once at its
 * final value, and a live region on a counting number is unusable.
 */
function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const reduced = useReducedMotion() ?? false;
  const [shown, setShown] = useState(reduced ? value : 0);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const durationMs = DURATION.deliberate * 1000;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      // Ease-out cubic — matches EASE.enter's deceleration.
      const eased = 1 - Math.pow(1 - progress, 3);
      setShown(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduced]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    // Tabular figures (§3.3): proportional digits jitter the width while
    // counting, which reads as a rendering bug rather than an animation.
    <span className="tabular-nums">
      {shown}
      {suffix}
    </span>
  );
}

function DeltaBadge({ delta }: { readonly delta: number }) {
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-3 py-1.5 text-xs font-bold text-muted-foreground">
        <Minus className="size-3.5" aria-hidden />
        Không đổi so với phiên trước
      </span>
    );
  }

  const improved = delta > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold ${
        improved
          ? "bg-quest-complete/15 text-quest-complete"
          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
      }`}
    >
      {improved ? (
        <TrendingUp className="size-3.5" aria-hidden />
      ) : (
        <TrendingDown className="size-3.5" aria-hidden />
      )}
      {improved ? "+" : ""}
      <span className="tabular-nums">{delta}%</span> so với phiên trước
    </span>
  );
}

export function SessionSummary({
  summary,
  turns,
  specialtyLabel,
  onRestart,
  onHome,
}: SessionSummaryProps) {
  const reduced = useReducedMotion() ?? false;
  const [previousPercent, setPreviousPercent] = useState<number | null>(null);
  const [sessionNumber, setSessionNumber] = useState(1);

  // Storage read in an effect, never during render — the server has no
  // localStorage and a render-time read would desync hydration.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const history = loadHistory();
    const index = history.findIndex(
      (entry) => entry.sessionId === summary.sessionId
    );
    setSessionNumber(index === -1 ? history.length + 1 : index + 1);

    const previous = index > 0 ? history[index - 1] : null;
    setPreviousPercent(
      previous ? toPercent(previous.totalScore, previous.maxScore) : null
    );
  }, [summary.sessionId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const percent = toPercent(summary.totalScore, summary.maxScore);
  // flatMap rather than filter so `evaluation` is narrowed to non-null for
  // the whole row, instead of needing an assertion at every use.
  const graded = turns.flatMap((turn) =>
    turn.evaluation ? [{ turn, evaluation: turn.evaluation }] : []
  );

  const rise = riseVariants(reduced, 12);
  // §9.4 — one celebrate per completion, and never a disappointed pose.
  const mascotState = percent >= 60 ? "celebrate" : "encouraging";

  return (
    <div className="h-full overflow-y-auto px-4 py-8 sm:px-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        {/* Beat 2 — the card rises in. */}
        <motion.div
          variants={rise}
          initial="hidden"
          animate="visible"
          custom={SESSION_COMPLETE.card}
        >
          <GlassCard variant="active" className="relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Phiên #{sessionNumber} · {specialtyLabel}
                </span>

                {/* Beat 3 — score counts up. The accessible name carries the
                    final value so a screen reader never hears the ticking. */}
                <div
                  className="mt-2 flex flex-wrap items-baseline gap-x-3"
                  aria-label={`Kết quả ${percent} phần trăm, ${summary.totalScore} trên ${summary.maxScore} điểm`}
                >
                  <span
                    aria-hidden
                    className="text-5xl font-extrabold text-foreground"
                  >
                    <CountUp value={percent} suffix="%" />
                  </span>
                  <span aria-hidden className="text-sm font-semibold text-muted-foreground">
                    <span className="tabular-nums">
                      {summary.totalScore}/{summary.maxScore}
                    </span>{" "}
                    điểm
                  </span>
                </div>
              </div>

              <Mascot state={mascotState} size={64} className="hidden sm:block" />
            </div>

            {/* Beat 4 — the delta lands last and hardest (principle 4). */}
            <motion.div
              className="mt-4"
              initial={reduced ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { ...SPRING.pop, delay: SESSION_COMPLETE.delta }
              }
            >
              {previousPercent === null ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-3 py-1.5 text-xs font-bold text-muted-foreground">
                  <Sparkles className="size-3.5" aria-hidden />
                  Đây là mốc khởi điểm của bạn
                </span>
              ) : (
                <DeltaBadge delta={percent - previousPercent} />
              )}
            </motion.div>
          </GlassCard>
        </motion.div>

        <motion.div
          variants={rise}
          initial="hidden"
          animate="visible"
          custom={SESSION_COMPLETE.score}
        >
          <GlassCard variant="quiet">
            <h2 className="text-sm font-bold text-foreground">
              Chi tiết từng câu
            </h2>
            <ul className="mt-3 space-y-3">
              {graded.map(({ turn, evaluation }, index) => (
                <li key={turn.id} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-foreground/5 text-xs font-bold tabular-nums text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {turn.question.prompt}
                    </p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                      {/* scaleX, not width — §8.6 bans layout-triggering
                          properties in animation. */}
                      <motion.div
                        className="h-full origin-left rounded-full bg-interview-accent"
                        initial={reduced ? false : { scaleX: 0 }}
                        animate={{
                          scaleX:
                            toPercent(evaluation.score, evaluation.maxScore) / 100,
                        }}
                        transition={
                          reduced
                            ? { duration: 0 }
                            : {
                                duration: DURATION.base,
                                ease: EASE.enter,
                                delay:
                                  SESSION_COMPLETE.score + index * STAGGER.list,
                              }
                        }
                      />
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-bold tabular-nums text-foreground">
                    {evaluation.score}/{evaluation.maxScore}
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>

        {/* Beat 5 — gaps stagger in, framed as the next quest rather than as
            a list of failures (principle 3). */}
        {summary.topGaps.length > 0 && (
          <motion.div
            variants={rise}
            initial="hidden"
            animate="visible"
            custom={SESSION_COMPLETE.gaps}
          >
            <GlassCard variant="quiet" className="border-amber-500/30">
              <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Target className="size-4 text-amber-600 dark:text-amber-400" aria-hidden />
                Chặng tiếp theo của bạn
              </h2>
              <ul className="mt-2.5 space-y-1.5">
                {summary.topGaps.map((gap, index) => (
                  <motion.li
                    key={gap}
                    initial={reduced ? false : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : {
                            duration: DURATION.quick,
                            ease: EASE.enter,
                            delay: SESSION_COMPLETE.gaps + index * STAGGER.list,
                          }
                    }
                    className="flex gap-2 text-xs leading-relaxed text-muted-foreground"
                  >
                    <span aria-hidden className="text-amber-600 dark:text-amber-400">
                      •
                    </span>
                    {gap}
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        )}

        {/* Beat 6 — exactly one primary action (§5.2). "Về trang chủ" is
            deliberately a plain button so it stays visually subordinate. */}
        <motion.div
          variants={rise}
          initial="hidden"
          animate="visible"
          custom={SESSION_COMPLETE.action}
          className="flex flex-wrap items-center gap-3 pb-4"
        >
          <ActionBubble
            icon={<RotateCcw className="size-4" aria-hidden />}
            onClick={onRestart}
          >
            Luyện phiên mới
          </ActionBubble>
          <Button
            type="button"
            variant="ghost"
            onClick={onHome}
            className="rounded-full px-5"
          >
            Về trang chủ
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
