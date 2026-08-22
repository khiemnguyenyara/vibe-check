"use client";

import { useEffect } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";

import type { ResolvedNode } from "@/components/home/types";

import { CareerCard } from "./career-card";
import { specialtyCarouselStyles as styles } from "./specialty-carousel.styles";

const SECONDS_PER_ITEM = 5;

/**
 * Continuous right-to-left marquee over one domain's specialties — every
 * `CareerCard` visible at once, scrolling rather than paging. The node list
 * is rendered twice back to back and the track animates from 0% to -50% on
 * a perfect loop, so the seam never shows regardless of how wide the cards
 * render (no pixel measurement needed).
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
  const controls = useAnimationControls();
  const duration = nodes.length * SECONDS_PER_ITEM;

  function play() {
    if (reduced) return;
    controls.start({
      x: ["0%", "-50%"],
      transition: { duration, ease: "linear", repeat: Infinity },
    });
  }

  useEffect(() => {
    play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, duration]);

  const loopedNodes = [...nodes, ...nodes];

  return (
    <div
      className={styles.viewport}
      onMouseEnter={() => controls.stop()}
      onMouseLeave={play}
      onFocus={() => controls.stop()}
      onBlur={play}
    >
      <motion.div
        className={styles.track}
        animate={controls}
        initial={{ x: "0%" }}
      >
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
