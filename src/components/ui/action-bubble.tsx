"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { SPRING } from "@/lib/motion/tokens";

/**
 * ActionBubble — specs/003-ui-ux-blueprint.md §5.
 *
 * The one primary action per screen (principle 2). Everything about it is
 * shaped by that: it is the only control that breathes at rest, and the only
 * one carrying `floating` elevation.
 */

export type ActionBubbleState =
  | "ready"
  | "loading"
  | "disabled"
  | "success";

interface ActionBubbleProps
  extends Omit<
    React.ComponentProps<"button">,
    "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag" | "disabled"
  > {
  /** Verb, not adjective — "Bắt đầu luyện tập", never "Sẵn sàng" (§5.2). */
  readonly children: React.ReactNode;
  readonly state?: ActionBubbleState;
  readonly icon?: React.ReactNode;
  /**
   * §8.5's idle breath. On by default for hero CTAs, where drawing the eye
   * to the one thing to do is the entire point.
   *
   * Turn it OFF for inline controls inside a form. A send button that never
   * stops moving is visual noise next to a field the user is typing in, and
   * a click target perpetually in motion is measurably harder to hit — a
   * small but real cost for anyone with a motor impairment, and the reason
   * this is a prop rather than a constant.
   */
  readonly breathing?: boolean;
}

export function ActionBubble({
  children,
  state = "ready",
  icon,
  breathing = true,
  className,
  ...props
}: ActionBubbleProps) {
  const reduced = useReducedMotion() ?? false;

  const isLoading = state === "loading";
  const isDisabled = state === "disabled" || isLoading;

  // §5.2 — the idle breath stops on disabled and loading. A control that
  // breathes but cannot be pressed reads as unresponsive, not inviting.
  const breathes = breathing && state === "ready" && !reduced;

  return (
    <motion.button
      type="button"
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      data-state={state}
      // §8.2 — press feedback is the one place a spring belongs.
      whileTap={isDisabled || reduced ? undefined : { scale: 0.96 }}
      transition={SPRING.press}
      animate={
        state === "success" && !reduced
          ? { scale: [1, 1.06, 1] }
          : { scale: 1 }
      }
      className={cn(
        // Minimum 44px hit target regardless of visual size (§5.2).
        "relative inline-flex min-h-11 items-center justify-center gap-2",
        "rounded-full px-6 py-2.5 text-sm font-bold tracking-tight",
        "bg-interview-accent text-interview-accent-foreground",
        "shadow-[0_8px_24px_-8px_var(--quest-glow)]",
        "transition-[background-color,box-shadow,opacity] duration-200",
        "hover:shadow-[0_12px_32px_-8px_var(--quest-glow)]",
        // Focus ring is independent of hover (§4.3) — a ring that only shows
        // on hover does not exist for keyboard users.
        "outline-none focus-visible:ring-2 focus-visible:ring-interview-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isDisabled &&
          "cursor-not-allowed bg-muted text-muted-foreground shadow-none hover:shadow-none",
        breathes && "animate-quest-breath",
        "motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      {/* §5.1 — width is locked to the ready-state label so swapping in the
          spinner cannot reflow the layout around it. The label keeps its
          space and is hidden, rather than being removed. */}
      <span
        className={cn(
          "inline-flex items-center gap-2",
          isLoading && "invisible"
        )}
      >
        {icon}
        {children}
      </span>
      {isLoading && (
        <span className="absolute inset-0 grid place-items-center">
          <Loader2 className="size-4 animate-spin" />
          <span className="sr-only">Đang xử lý…</span>
        </span>
      )}
    </motion.button>
  );
}
