"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * template.tsx (unlike layout.tsx) remounts on every navigation, which is
 * what gives this its enter transition on each route change.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
