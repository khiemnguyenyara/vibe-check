"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Trophy } from "lucide-react";

import { CoachGrid } from "@/components/home/coach-grid";
import { fieldAccent } from "@/components/home/field-accent";
import { HeroSearch } from "@/components/home/hero-search";
import { StatsBooking } from "@/components/home/stats-booking";
import type { ResolvedNode } from "@/components/home/types";
import { useFieldNavigation } from "@/components/home/use-field-navigation";
import { LevelPickerDialog } from "@/components/interview/level-picker-dialog";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ActionBubble } from "@/components/ui/action-bubble";
import { GlassCard } from "@/components/ui/glass-card";
import { domains } from "@/lib/domains";
import { formatMessage } from "@/lib/i18n/format";
import { useLocale } from "@/lib/i18n/locale-context";
import { riseVariants } from "@/lib/motion/tokens";

/**
 * The practice home — specs/003-ui-ux-blueprint.md §7 and §10.1.
 *
 * ## Why this is not one connected map
 *
 * An earlier build rendered every domain as a station on a single continuous
 * spine, which read as a journey from Frontend to SEO to UI/UX. That is a
 * career change, not a practice plan. Vibe Check serves a candidate
 * preparing for interviews in *their own* profession: fields and specialties
 * are **parallel choices**, and the only real progression is repeated
 * sessions at the specialty you already work in, with the score climbing.
 *
 * So: no connector between fields, no connector between specialties, and no
 * "next step" presumed for someone who has not told us their trade.
 */

/**
 * The returning candidate's own specialty, carrying the only progression
 * this product actually has: sessions sat, and the best score so far.
 */
function CurrentTrackCard({
  node,
  onResume,
  delay,
}: {
  readonly node: ResolvedNode;
  readonly onResume: () => void;
  readonly delay: number;
}) {
  const reduced = useReducedMotion() ?? false;
  const { t } = useLocale();
  const Icon = node.specialty.icon;
  const best = node.record?.bestPercent ?? 0;
  const attempts = node.record?.attempts ?? 0;

  return (
    <motion.div
      variants={riseVariants(reduced)}
      initial="hidden"
      animate="visible"
      custom={delay}
      style={fieldAccent(node.domain.id)}
    >
      <GlassCard variant="active">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t.home.currentTrack.label}
        </p>

        <div className="mt-3 flex items-start gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-interview-accent text-interview-accent-foreground">
            <Icon className="size-6" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-extrabold text-foreground">
              {node.specialty.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              {node.domain.sectionTitle}
            </p>
          </div>
        </div>

        {/* The real progression: repeated attempts at your own role, and the
            best result so far. Not movement between professions. */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {t.home.currentTrack.bestScore}
              </span>
              <span className="text-sm font-extrabold tabular-nums text-interview-accent-text">
                {best}%
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-foreground/10">
              <motion.div
                className="h-full origin-left rounded-full bg-interview-accent"
                initial={reduced ? false : { scaleX: 0 }}
                animate={{ scaleX: best / 100 }}
                transition={reduced ? { duration: 0 } : { duration: 0.45, delay }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-muted-foreground">
              {t.home.currentTrack.sessionCount}
            </p>
            <p className="text-sm font-extrabold tabular-nums text-foreground">
              {attempts}
            </p>
          </div>
        </div>

        {node.record?.mastered && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-quest-complete/15 px-2.5 py-1 text-xs font-bold text-quest-complete">
            <Trophy className="size-3.5" aria-hidden />
            {t.home.currentTrack.mastered}
          </p>
        )}

        <div className="mt-4">
          <ActionBubble
            icon={<Play className="size-4" aria-hidden />}
            onClick={onResume}
          >
            {formatMessage(t.home.currentTrack.resume, {
              specialty: node.specialty.title,
            })}
          </ActionBubble>
        </div>
      </GlassCard>
    </motion.div>
  );
}

const SPECIALTY_COUNT = domains.reduce(
  (total, domain) => total + domain.specialties.length,
  0
);

export default function Home() {
  const reduced = useReducedMotion() ?? false;
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    byField,
    activeNode,
    lockNotice,
    handleEnter,
    pendingNode,
    handleConfirmLevel,
    closeLevelPicker,
  } = useFieldNavigation();

  function scrollToCoaches() {
    document
      .getElementById("coaches")
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  return (
    <div className="relative bg-background text-foreground">
      {/* Ambient field. Fixed and non-scrolling, so the blurred surfaces above
          it composite against something stable (§4.4). */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden bg-gradient-to-b from-violet-100/70 via-transparent to-fuchsia-100/50 dark:from-violet-950/30 dark:to-fuchsia-950/20"
      >
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-interview-accent/15 blur-3xl" />
        <div className="absolute -right-32 top-1/3 size-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />

        {/* Sibling of <main>, not nested inside it, so the hero's gradient
            backdrop can bleed to the full viewport width. */}
        <HeroSearch query={searchQuery} onQueryChange={setSearchQuery} />

        <main className="mx-auto w-full max-w-7xl flex-1 px-3 pb-10 pt-6 sm:px-4">
          {/* The single primary action (§5.2) — but only for someone who has
              told us their trade by practising it. A newcomer gets no hero
              CTA, because any specialty we picked for them would be a guess
              about their profession. */}
          {/* {activeNode && (
            <div className="mb-4">
              <CurrentTrackCard
                node={activeNode}
                onResume={() => handleEnter(activeNode)}
                delay={MAP_ENTRY.header + 0.06}
              />
            </div>
          )} */}

          {/* <StatsBooking
            specialtyCount={SPECIALTY_COUNT}
            domainCount={domains.length}
            onExplore={scrollToCoaches}
            onBookingCta={scrollToCoaches}
          /> */}

          <div className="mt-10">
            <motion.div
              variants={riseVariants(reduced)}
              initial="hidden"
              animate="visible"
              custom={0.1}
            >
              <h2 className="text-lg font-extrabold text-foreground">
                {activeNode
                  ? t.home.sections.yourSpecialtyTitle
                  : t.home.sections.chooseFieldTitle}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {activeNode
                  ? t.home.sections.otherFieldsBody
                  : t.home.sections.chooseFieldBody}
              </p>
            </motion.div>

            <div className="mt-4">
              <CoachGrid
                byField={byField}
                searchQuery={searchQuery}
                onEnter={handleEnter}
              />
            </div>
          </div>

          {/* Locked-node explanation. A polite live region rather than a
              dialog: it answers a question the user just asked by tapping,
              and should not seize focus to do it. */}
          <p
            aria-live="polite"
            className="mt-6 text-center text-xs font-medium text-muted-foreground"
          >
            {lockNotice}
          </p>
        </main>

        <SiteFooter />
      </div>

      <LevelPickerDialog
        open={pendingNode !== null}
        specialtyLabel={pendingNode?.specialty.title ?? ""}
        onOpenChange={(open) => {
          if (!open) closeLevelPicker();
        }}
        onConfirm={handleConfirmLevel}
      />
    </div>
  );
}
