"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { riseVariants } from "@/lib/motion/tokens";

import { fieldMentorStyles as styles } from "./field-mentor.styles";

/**
 * An illustrated mentor introducing a field — currently just Dok, for
 * Development (`field-hero.ts`). Distinct from `@/components/mascot` (the
 * abstract geometric companion used inside an interview session, specs/003
 * §9): that one is deliberately shape-only because it must express every
 * session state as a transform. A field mentor has no states to express —
 * it introduces one field, once, on one page — so a rendered character is
 * fine here without reopening §9's decision.
 */
export function FieldMentor({
  line,
}: {
  readonly line?: string;
}) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      variants={riseVariants(reduced)}
      initial="hidden"
      animate="visible"
      custom={0}
      className={styles.root}
    >
      {line && <p className={styles.line}>{line}</p>}
    </motion.div>
  );
}
