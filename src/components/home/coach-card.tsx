"use client";

import Image from "next/image";
import { ArrowUpRight, Check, Lock, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { QuestNodeState } from "@/components/quest/quest-node";
import { avatarUrl } from "@/lib/avatar";
import { cn } from "@/lib/utils";

import { fieldAccent } from "./field-accent";
import type { ResolvedNode } from "./types";

const DIFFICULTY_LEVELS = [1, 2, 3] as const;

function StateGlyph({ state }: { readonly state: QuestNodeState }) {
  if (state === "locked") return <Lock className="size-4" aria-hidden />;
  if (state === "mastered")
    return <Star className="size-4 fill-current" aria-hidden />;
  if (state === "completed") return <Check className="size-4" aria-hidden />;
  return <ArrowUpRight className="size-4" aria-hidden />;
}

export function CoachCard({
  node,
  onActivate,
  delay = 0,
}: {
  readonly node: ResolvedNode;
  readonly onActivate: () => void;
  readonly delay?: number;
}) {
  const reduced = useReducedMotion() ?? false;
  const { domain, specialty, state, record, lockedReason } = node;
  const bestPercent = record?.bestPercent;
  const isLocked = state === "locked";

  return (
    <motion.button
      type="button"
      onClick={onActivate}
      // Locked cards stay tappable so they can explain themselves instead of
      // going dead — same reasoning as CareerCard/QuestNode.
      aria-disabled={isLocked || undefined}
      aria-label={`${specialty.title} — ${domain.sectionTitle}${
        isLocked && lockedReason ? `. ${lockedReason}` : ""
      }`}
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduced ? { duration: 0 } : { duration: 0.28, ease: [0, 0, 0.2, 1], delay }
      }
      whileTap={reduced || isLocked ? undefined : { scale: 0.98 }}
      style={fieldAccent(domain.id)}
      className={cn(
        "group relative flex aspect-[4/5] w-full flex-col overflow-hidden rounded-2xl border border-quest-surface-border bg-transparent text-left",
        "transition-[box-shadow,transform]",
        "outline-none focus-visible:ring-2 focus-visible:ring-interview-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isLocked
          ? "opacity-70"
          : "hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_var(--quest-glow)] motion-reduce:hover:translate-y-0"
      )}
    >
      {/* Background image spans the entire card; everything else floats
          on top of it as glass panels instead of living in its own
          section below. */}
      <div className={cn("absolute inset-0", domain.theme.wash)}>
        <Image
          src={avatarUrl(`${domain.id}-${specialty.id}`)}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          aria-hidden
          className={cn(
            "object-contain p-10 sm:p-12 lg:p-14",
            isLocked && "grayscale"
          )}
        />
        {/* Scrim so glass overlays stay legible against a busy photo. */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-background/10" />
      </div>

      <span
        className={cn(
          "absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur-md",
          domain.theme.pillBg,
          domain.theme.pillText
        )}
      >
        {domain.sectionTitle}
      </span>

      <span
        className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-quest-surface/40 px-1.5 py-1 backdrop-blur-md"
        aria-hidden
      >
        {DIFFICULTY_LEVELS.map((level) => (
          <span
            key={level}
            className={cn(
              "h-1.5 w-3 rounded-full",
              level <= specialty.difficulty
                ? "bg-white/90"
                : "bg-white/30"
            )}
          />
        ))}
      </span>

      {isLocked && (
        <div className="absolute inset-0 grid place-items-center bg-background/40">
          <Lock className="size-6 text-foreground" aria-hidden />
        </div>
      )}

      {/* Description + title bar sit as a single glass panel pinned to
          the bottom, overlaid on the full-bleed image. */}
      <div className="relative mt-auto flex flex-col gap-1.5 p-3.5">
        <p className="line-clamp-2 text-[11px] leading-relaxed text-foreground/80">
          {specialty.description}
        </p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {/* Title as a frosted-glass badge — same border/blur/bg tokens as
                the hero's pill badge, so every "badge" in the app reads the
                same regardless of where it shows up. */}
            <span className="inline-flex max-w-full items-center truncate rounded-full border border-quest-surface-border bg-quest-surface/70 px-3 py-1 text-sm font-bold text-foreground backdrop-blur-md">
              {specialty.title}
            </span>
            {bestPercent !== undefined && !isLocked && (
              <span className="shrink-0 text-[11px] font-bold tabular-nums text-quest-complete">
                {bestPercent}%
              </span>
            )}
          </div>

          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full backdrop-blur-md",
              isLocked
                ? "bg-quest-locked/80 text-quest-locked-foreground"
                : "bg-interview-accent/80 text-interview-accent-foreground"
            )}
          >
            <StateGlyph state={state} />
          </span>
        </div>
      </div>
    </motion.button>
  );
}
