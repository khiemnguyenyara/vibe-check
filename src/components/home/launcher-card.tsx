"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { GlassCard } from "@/components/ui/glass-card";
import { riseVariants } from "@/lib/motion/tokens";

import { launcherCardStyles, launcherCardVariants } from "./launcher-card.styles";

/**
 * One choice on the home launcher — a link when `href` is set, a button when
 * `onClick` is set (e.g. opens a picker dialog instead of navigating
 * straight away), or a disabled placeholder when neither is given.
 */
export function LauncherCard({
  href,
  onClick,
  title,
  body,
  badge,
  delay = 0,
  reduced = false,
}: {
  readonly href?: string;
  readonly onClick?: () => void;
  readonly title: string;
  readonly body: string;
  readonly badge?: string;
  readonly delay?: number;
  readonly reduced?: boolean;
}) {
  const disabled = !href && !onClick;

  const content = (
    <GlassCard
      variant={disabled ? "quiet" : "interactive"}
      className={launcherCardVariants({ disabled })}
    >
      <div>
        <h2 className={launcherCardStyles.title}>{title}</h2>
        <p className={launcherCardStyles.body}>{body}</p>
      </div>
      {badge && <span className={launcherCardStyles.badge}>{badge}</span>}
    </GlassCard>
  );

  return (
    <motion.div
      variants={riseVariants(reduced)}
      initial="hidden"
      animate="visible"
      custom={delay}
    >
      {href ? (
        <Link href={href} className={launcherCardStyles.link}>
          {content}
        </Link>
      ) : onClick ? (
        <button
          type="button"
          onClick={onClick}
          className={launcherCardStyles.trigger}
        >
          {content}
        </button>
      ) : (
        content
      )}
    </motion.div>
  );
}
