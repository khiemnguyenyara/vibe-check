"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

import type { ResolvedNode } from "@/components/home/types";

import { CareerCard } from "./career-card";
import { specialtyCarouselStyles as styles } from "./specialty-carousel.styles";

const SECONDS_PER_ITEM = 5;

/**
 * Continuous right-to-left marquee over one domain's specialties — every
 * `CareerCard` visible at once, scrolling rather than paging. The node list
 * is rendered twice back to back and the track loops from 0% to -50%, so the
 * seam never shows regardless of how wide the cards render (no pixel
 * measurement needed).
 *
 * Driven by a manual `useAnimationFrame` tick rather than a declarative
 * keyframe animation so that pausing (hover/focus) and resuming just
 * toggles a flag — the track keeps going from wherever it stopped instead
 * of snapping back to the keyframe's start on every resume.
 *
 * Autoplay pauses on hover/focus (WCAG 2.2.2 — a moving target a
 * keyboard/mouse user is actively engaging with must stop moving) and never
 * starts under `prefers-reduced-motion` (specs/003 §8.5/§11).
 */
export function SpecialtyCarousel({
  nodes,
  onActivate,
}: {
  readonly nodes: readonly ResolvedNode[];
  readonly onActivate: (node: ResolvedNode) => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const pausedRef = useRef(false);
  const percent = useMotionValue(0);
  const x = useTransform(percent, (v) => `${v}%`);
  const duration = nodes.length * SECONDS_PER_ITEM;

  useAnimationFrame((_, delta) => {
    if (reduced || pausedRef.current) return;
    const next = percent.get() - (delta / 1000 / duration) * 50;
    percent.set(next <= -50 ? next + 50 : next);
  });

  const loopedNodes = [...nodes, ...nodes];
  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div
      className={styles.viewport}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <motion.div className={styles.track} style={{ x }}>
        {loopedNodes.map((node, i) => (
          <div key={`${node.specialty.id}-${i}`} className={styles.slide}>
            <CareerCard
              title={node.specialty.title}
              description={node.specialty.description}
              icon={node.specialty.icon}
              state={node.state}
              difficulty={node.specialty.difficulty}
              bestPercent={node.record?.bestPercent}
              lockedReason={node.lockedReason}
              onActivate={() => onActivate(node)}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
