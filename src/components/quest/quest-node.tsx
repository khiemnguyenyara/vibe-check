"use client";

import type { LucideIcon } from "lucide-react";
import { Check, Lock, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { SPRING } from "@/lib/motion/tokens";

/**
 * QuestNode — specs/003-ui-ux-blueprint.md §6.
 *
 * One specialty on the map. Five states, and the visual distinction between
 * them never rests on hue alone: each carries its own glyph and fill
 * treatment, because §11 requires state be legible without colour.
 */

export type QuestNodeState =
  | "locked"
  | "available"
  | "active"
  | "completed"
  | "mastered";

interface QuestNodeProps {
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly state: QuestNodeState;
  readonly difficulty: 1 | 2 | 3;
  /** Best score so far, 0–100. Announced to screen readers when present. */
  readonly bestPercent?: number;
  /** Why this is locked — surfaced on activation, never on a dead tap. */
  readonly lockedReason?: string;
  readonly onActivate: () => void;
  readonly delay?: number;
}

/** Screen-reader label. §11 requires state be announced as text. */
function stateLabel(state: QuestNodeState, bestPercent?: number): string {
  switch (state) {
    case "locked":
      return "chưa mở khoá";
    case "available":
      return "sẵn sàng";
    case "active":
      return "đang theo học";
    case "completed":
      return `đã hoàn thành${bestPercent !== undefined ? `, ${bestPercent}%` : ""}`;
    case "mastered":
      return `đã thành thạo${bestPercent !== undefined ? `, ${bestPercent}%` : ""}`;
  }
}

function StateGlyph({ state }: { state: QuestNodeState }) {
  // Glyph, not colour, is the primary state signal (§11 colour independence).
  if (state === "locked") return <Lock className="size-3.5" aria-hidden />;
  if (state === "mastered")
    return <Star className="size-3.5 fill-current" aria-hidden />;
  if (state === "completed") return <Check className="size-3.5" aria-hidden />;
  return null;
}

export function QuestNode({
  title,
  description,
  icon: Icon,
  state,
  difficulty,
  bestPercent,
  lockedReason,
  onActivate,
  delay = 0,
}: QuestNodeProps) {
  const reduced = useReducedMotion() ?? false;
  const isLocked = state === "locked";

  return (
    <motion.button
      type="button"
      onClick={onActivate}
      // §6.1 — locked nodes stay activatable so they can explain themselves.
      // A dead tap is the most confusing interaction on a map, whose entire
      // affordance is "these are places you can go".
      aria-disabled={isLocked || undefined}
      aria-label={`${title}, ${stateLabel(state, bestPercent)}${
        isLocked && lockedReason ? `. ${lockedReason}` : ""
      }`}
      data-state={state}
      initial={reduced ? false : { opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={
        reduced
          ? { duration: 0 }
          : state === "active"
            ? { ...SPRING.pop, delay }
            : { duration: 0.28, ease: [0, 0, 0.2, 1], delay }
      }
      whileTap={reduced || isLocked ? undefined : { scale: 0.97 }}
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-2xl border p-3 text-left",
        "outline-none transition-[box-shadow,transform,border-color]",
        "focus-visible:ring-2 focus-visible:ring-interview-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "motion-reduce:transition-none",
        // Deliberately not backdrop-blurred: several nodes are on screen at
        // once inside a scrolling column, which §4.4 and §12.3 rule out.
        isLocked
          ? "border-quest-surface-border bg-quest-locked/60 cursor-default"
          : "border-quest-surface-border bg-quest-surface hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-10px_var(--quest-glow)] motion-reduce:hover:translate-y-0",
        state === "active" &&
          "border-interview-accent/50 shadow-[0_10px_30px_-12px_var(--quest-glow)]"
      )}
    >
      <span
        className={cn(
          "relative grid size-10 shrink-0 place-items-center rounded-xl",
          isLocked && "bg-quest-locked text-quest-locked-foreground",
          state === "available" &&
            "border-2 border-interview-accent/60 text-interview-accent",
          state === "active" &&
            "bg-interview-accent text-interview-accent-foreground",
          (state === "completed" || state === "mastered") &&
            "bg-quest-complete text-quest-complete-foreground",
          // §8.5 — the active node is one of only two things that move at
          // rest. The class itself is a no-op under reduced motion.
          state === "active" && "animate-quest-float"
        )}
      >
        <Icon className="size-5" aria-hidden />
        {state !== "available" && state !== "active" && (
          <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-background text-foreground shadow-sm">
            <StateGlyph state={state} />
          </span>
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "truncate text-sm font-bold",
              isLocked ? "text-quest-locked-foreground" : "text-foreground"
            )}
          >
            {title}
          </span>
          {bestPercent !== undefined && !isLocked && (
            <span className="shrink-0 rounded-full bg-quest-complete/15 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-quest-complete">
              {bestPercent}%
            </span>
          )}
        </span>
        {/* Always the description. §6.2: the lock reason is surfaced once at
            the top of the map and on activation — repeating it beside every
            node reads as nagging and buries the actual path forward. It still
            reaches assistive tech through this node's aria-label. */}
        <span
          className={cn(
            "mt-0.5 line-clamp-2 block text-xs leading-relaxed",
            isLocked ? "text-quest-locked-foreground" : "text-muted-foreground"
          )}
        >
          {description}
        </span>

        <span className="mt-2 flex items-center gap-1" aria-hidden>
          {[1, 2, 3].map((level) => (
            <span
              key={level}
              className={cn(
                "h-1 w-4 rounded-full",
                level <= difficulty
                  ? isLocked
                    ? "bg-quest-locked-foreground/40"
                    : "bg-interview-accent/70"
                  : "bg-foreground/10"
              )}
            />
          ))}
        </span>
      </span>
    </motion.button>
  );
}
