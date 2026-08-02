"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";
import { DURATION, EASE, SPRING } from "@/lib/motion/tokens";

/**
 * The companion — specs/003-ui-ux-blueprint.md §9.
 *
 * ## Design note
 *
 * §13 Q2 recorded that no character design existed. This is it: a rounded
 * "spark" orb with a single antenna and two eyes. Deliberately geometric —
 * every state in §9.2 has to be expressible as a transform on a handful of
 * shapes, because §12.2 rejects Lottie/Rive and inline SVG is what remains.
 * A character with rendered detail could not do that.
 *
 * It is `aria-hidden` (§9.3) and therefore must never be the only thing
 * saying something. Every state below has a text or visual counterpart
 * elsewhere on screen — that is a hard requirement of §11, not a courtesy.
 */

export type MascotState =
  | "idle"
  | "thinking"
  | "encouraging"
  | "celebrate"
  | "resting";

interface MascotProps {
  readonly state?: MascotState;
  readonly className?: string;
  /** Rendered size in px. Below 380px viewport the caller hides it (§9.3). */
  readonly size?: number;
}

/** Whole-body posture per state. */
function bodyVariants(reduced: boolean): Variants {
  if (reduced) {
    // §11 — no idle motion, no entrance movement. The character still
    // changes *pose* between states, because pose is information; only the
    // travel between poses is removed.
    return {
      idle: { y: 0, rotate: 0, scale: 1 },
      thinking: { y: 0, rotate: -6, scale: 1 },
      encouraging: { y: 0, rotate: 4, scale: 1 },
      celebrate: { y: 0, rotate: 0, scale: 1 },
      resting: { y: 0, rotate: 0, scale: 1 },
    };
  }

  return {
    idle: {
      y: [0, -3, 0],
      rotate: 0,
      scale: 1,
      transition: { duration: 3.2, repeat: Infinity, ease: EASE.move },
    },
    thinking: {
      y: 0,
      rotate: -8,
      scale: 1,
      transition: { duration: DURATION.base, ease: EASE.enter },
    },
    encouraging: {
      y: [0, -2, 0],
      rotate: 5,
      scale: 1.03,
      transition: { duration: 1.6, repeat: Infinity, ease: EASE.move },
    },
    celebrate: {
      y: [0, -14, 0],
      scale: [1, 1.12, 1],
      rotate: [0, -8, 8, 0],
      transition: { duration: DURATION.celebratory, ease: EASE.move },
    },
    resting: {
      y: 0,
      rotate: 0,
      scale: 0.97,
      transition: { duration: DURATION.deliberate, ease: EASE.enter },
    },
  };
}

/** Eyes: open, looking, or closed. scaleY drives the blink and the rest. */
const eyeVariants: Variants = {
  idle: {
    scaleY: [1, 1, 0.1, 1],
    transition: { duration: 4, repeat: Infinity, times: [0, 0.92, 0.96, 1] },
  },
  thinking: { scaleY: 1, x: 2 },
  encouraging: { scaleY: 1, x: 0 },
  celebrate: { scaleY: 0.35, x: 0 },
  resting: { scaleY: 0.12, x: 0 },
};

export function Mascot({ state = "idle", className, size = 72 }: MascotProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.svg
      // §9.3 — conveys nothing a screen-reader user needs; announcing it is
      // noise on every single state change.
      aria-hidden
      focusable="false"
      role="presentation"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn("shrink-0 select-none", className)}
      variants={bodyVariants(reduced)}
      animate={state}
      initial={false}
    >
      {/* Ambient bloom, accent-derived so a module override recolours it. */}
      <circle cx="50" cy="56" r="34" fill="var(--quest-glow)" opacity="0.35" />

      {/* Antenna — the "spark". Reads as alertness without needing a face. */}
      <motion.g
        variants={{
          idle: { rotate: 0 },
          thinking: { rotate: reduced ? 0 : [0, 10, -10, 0] },
          encouraging: { rotate: 6 },
          celebrate: { rotate: reduced ? 0 : [0, -18, 18, 0] },
          resting: { rotate: -12 },
        }}
        transition={
          state === "thinking"
            ? { duration: 1.4, repeat: Infinity, ease: EASE.move }
            : SPRING.pop
        }
        style={{ originX: "50px", originY: "26px" }}
      >
        <line
          x1="50"
          y1="26"
          x2="50"
          y2="12"
          stroke="var(--interview-accent)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="50" cy="9" r="5" fill="var(--interview-accent)" />
      </motion.g>

      {/* Body */}
      <rect
        x="20"
        y="26"
        width="60"
        height="56"
        rx="26"
        fill="var(--interview-accent)"
      />

      {/* Eyes */}
      <motion.g
        variants={eyeVariants}
        animate={state}
        initial={false}
        style={{ originY: "52px" }}
      >
        <ellipse
          cx="39"
          cy="52"
          rx="5"
          ry="6.5"
          fill="var(--interview-accent-foreground)"
        />
        <ellipse
          cx="61"
          cy="52"
          rx="5"
          ry="6.5"
          fill="var(--interview-accent-foreground)"
        />
      </motion.g>

      {/* Mouth — a simple arc whose curvature carries the emotional register.
          Flat for thinking, upturned otherwise; never downturned, because
          principle 3 forbids a disappointed companion. */}
      <motion.path
        fill="none"
        stroke="var(--interview-accent-foreground)"
        strokeWidth="3"
        strokeLinecap="round"
        variants={{
          idle: { d: "M 42 66 Q 50 71 58 66" },
          thinking: { d: "M 43 67 L 57 67" },
          encouraging: { d: "M 41 65 Q 50 73 59 65" },
          celebrate: { d: "M 40 64 Q 50 77 60 64" },
          resting: { d: "M 44 67 Q 50 70 56 67" },
        }}
        animate={state}
        initial={false}
        transition={
          reduced ? { duration: 0 } : { duration: DURATION.quick, ease: EASE.move }
        }
      />
    </motion.svg>
  );
}
