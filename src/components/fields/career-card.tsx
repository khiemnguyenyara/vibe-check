"use client";

import type { LucideIcon } from "lucide-react";
import { Check, Lock, Play, RotateCcw, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { QuestNodeState } from "@/components/quest/quest-node";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

/**
 * CareerCard — the /fields/[domain] specialty card. Visually distinct from
 * `QuestNode` (home page keeps that one unchanged) but the same state
 * machine and the same §11 rule: state is never color-only, always a glyph
 * plus a real text label, and a locked card still explains itself on tap
 * (via the caller's `onActivate` → shared `lockNotice`) rather than doing
 * nothing.
 */

const DIFFICULTY_LABEL: Record<1 | 2 | 3, string> = {
  1: "Cơ bản",
  2: "Trung bình",
  3: "Khó",
};

function stateLabel(state: QuestNodeState, bestPercent?: number): string {
  switch (state) {
    case "locked":
      return "Chưa mở khoá";
    case "available":
      return "Sẵn sàng luyện tập";
    case "active":
      return "Đang luyện tập";
    case "completed":
      return `Đã hoàn thành${bestPercent !== undefined ? `, ${bestPercent}%` : ""}`;
    case "mastered":
      return `Đã thành thạo${bestPercent !== undefined ? `, ${bestPercent}%` : ""}`;
  }
}

function StateGlyph({ state }: { readonly state: QuestNodeState }) {
  if (state === "locked") return <Lock className="size-3.5" aria-hidden />;
  if (state === "mastered")
    return <Star className="size-3.5 fill-current" aria-hidden />;
  if (state === "completed") return <Check className="size-3.5" aria-hidden />;
  return null;
}

function ctaFor(state: QuestNodeState): { label: string; icon: LucideIcon } {
  switch (state) {
    case "locked":
      return { label: "Đã khoá", icon: Lock };
    case "active":
      return { label: "Tiếp tục luyện tập", icon: Play };
    case "completed":
    case "mastered":
      return { label: "Luyện lại", icon: RotateCcw };
    case "available":
      return { label: "Bắt đầu luyện tập", icon: Play };
  }
}

interface CareerCardProps {
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly state: QuestNodeState;
  readonly difficulty: 1 | 2 | 3;
  readonly bestPercent?: number;
  readonly lockedReason?: string;
  readonly onActivate: () => void;
  readonly delay?: number;
}

export function CareerCard({
  title,
  description,
  icon: Icon,
  state,
  difficulty,
  bestPercent,
  lockedReason,
  onActivate,
  delay = 0,
}: CareerCardProps) {
  const reduced = useReducedMotion() ?? false;
  const isLocked = state === "locked";
  const cta = ctaFor(state);

  return (
    <motion.button
      type="button"
      onClick={onActivate}
      // Locked cards stay activatable so they can explain themselves — a
      // dead tap is the most confusing interaction here (same reasoning
      // quest-node.tsx documents for §6.1).
      aria-disabled={isLocked || undefined}
      aria-label={`${title}, ${stateLabel(state, bestPercent)}${
        isLocked && lockedReason ? `. ${lockedReason}` : ""
      }`}
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.28, ease: [0, 0, 0.2, 1], delay }}
      whileTap={reduced || isLocked ? undefined : { scale: 0.98 }}
      className="h-full w-full text-left"
    >
      <GlassCard
        variant={isLocked ? "quiet" : "interactive"}
        className={cn(
          "flex h-full flex-col gap-3 hover:shadow-sm",
          isLocked && "opacity-70"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "grid size-12 place-items-center rounded-2xl",
              isLocked
                ? "bg-quest-locked text-quest-locked-foreground"
                : "bg-interview-accent text-interview-accent-foreground"
            )}
          >
            <Icon className="size-6" aria-hidden />
          </span>
          <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {DIFFICULTY_LABEL[difficulty]}
          </span>
        </div>

        <div>
          <h3
            className={cn(
              "text-base font-bold",
              isLocked ? "text-quest-locked-foreground" : "text-foreground"
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "mt-1 text-sm leading-relaxed",
              isLocked ? "text-quest-locked-foreground" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <StateGlyph state={state} />
            {stateLabel(state, bestPercent)}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-sm font-bold",
              isLocked ? "text-quest-locked-foreground" : "text-interview-accent-text"
            )}
          >
            <cta.icon className="size-4" aria-hidden />
            {cta.label}
          </span>
        </div>
      </GlassCard>
    </motion.button>
  );
}
