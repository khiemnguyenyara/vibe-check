import type { Transition, Variants } from "framer-motion";

/**
 * Motion vocabulary for specs/003-ui-ux-blueprint.md §8.
 *
 * Every duration and curve in the product comes from here. The point is not
 * tidiness: it is that §8.1's "nothing exceeds 700ms" and §8.2's
 * "presses use springs, entrances use curves" are only true if there is one
 * place to violate them.
 */

/** §8.1 — seconds, because that is Framer's unit. */
export const DURATION = {
  instant: 0.1,
  quick: 0.18,
  base: 0.28,
  deliberate: 0.45,
  celebratory: 0.7,
} as const;

/**
 * §8.2 — cubic-bézier control points.
 * `enter` decelerates, `exit` accelerates, `move` does both. Using `enter`
 * for something leaving makes it linger; using `exit` for something arriving
 * makes it snap in and feel abrupt.
 */
export const EASE = {
  enter: [0, 0, 0.2, 1],
  exit: [0.4, 0, 1, 1],
  move: [0.4, 0, 0.2, 1],
} as const;

/**
 * §8.2 — springs are for pressure and reward only.
 *
 * `press` is high-stiffness/high-damping so it settles without wobble; a
 * bouncy press reads as a bug. `pop` is looser because overshoot is the
 * point when something unlocks.
 *
 * Neither is ever used on an opacity fade: a spring overshoots past 1 and
 * clamps, which renders as a flicker (§8.2).
 */
export const SPRING = {
  press: { type: "spring", stiffness: 620, damping: 32, mass: 0.6 },
  pop: { type: "spring", stiffness: 320, damping: 16, mass: 0.7 },
} as const satisfies Record<string, Transition>;

/** §8.6 — stagger caps at 8 items; past that, animate the container. */
export const MAX_STAGGER_ITEMS = 8;
export const STAGGER = {
  stations: 0.06,
  list: 0.05,
} as const;

/**
 * Reduced-motion transition: not "faster", but *instant*.
 *
 * §11 requires entrances be replaced with instant opacity rather than
 * shortened. A 50ms slide is still a slide, and still triggers the vestibular
 * response the rule exists to prevent.
 */
export const NO_MOTION: Transition = { duration: 0 };

export function enterTransition(reduced: boolean, delay = 0): Transition {
  return reduced
    ? NO_MOTION
    : { duration: DURATION.base, ease: EASE.enter, delay };
}

/**
 * Fade + rise. Under reduced motion the `y` offset collapses to 0 so the
 * element simply appears — the information is identical, the movement is not.
 */
export function riseVariants(reduced: boolean, distance = 8): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : distance },
    visible: (delay: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: enterTransition(reduced, delay),
    }),
  };
}

/** §8.3 `map.entry` beat offsets, in seconds. Total lands under 1s. */
export const MAP_ENTRY = {
  header: 0,
  spine: 0.08,
  stations: 0.14,
  activeNode: 0.12,
} as const;

/** §8.3 `session.complete` beat offsets, in seconds. */
export const SESSION_COMPLETE = {
  card: 0,
  score: 0.1,
  delta: 0.25,
  gaps: 0.35,
  action: 0.45,
} as const;
