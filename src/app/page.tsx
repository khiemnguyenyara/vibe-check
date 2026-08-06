"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Lock, Play, Trophy } from "lucide-react";

import { resolveNode } from "@/components/home/resolve-node";
import type { ResolvedNode } from "@/components/home/types";
import { useGuestState } from "@/components/home/use-guest-state";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QuestNode } from "@/components/quest/quest-node";
import { ActionBubble } from "@/components/ui/action-bubble";
import { GlassCard } from "@/components/ui/glass-card";
import { domains, type DomainConfig } from "@/lib/domains";
import { formatMessage } from "@/lib/i18n/format";
import { useLocale } from "@/lib/i18n/locale-context";
import { MAP_ENTRY, STAGGER, riseVariants } from "@/lib/motion/tokens";
import { GUEST_SESSION_LIMIT } from "@/lib/session/storage";

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

/** Field accent overrides, applied on a section root (§3.1). */
function fieldAccent(domainId: string): React.CSSProperties {
  return {
    "--interview-accent": `var(--station-accent-${domainId}, var(--interview-accent))`,
    "--interview-accent-text": `var(--station-accent-${domainId}-text, var(--station-accent-${domainId}, var(--interview-accent-text)))`,
  } as React.CSSProperties;
}

/** Hero backdrop — same treatment as the footer, low-opacity and held behind the copy. */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=60";

/** Auto-advancing hero. Fade only — no carousel controls, no drag. */
function HeroSlider() {
  const reduced = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const { t } = useLocale();
  const slides = t.home.hero.slides;

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      4500
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[index];

  return (
    /* A sibling of <main>, not a child of it — <main> is capped at max-w-5xl,
       so a child can only bleed to the edge of that box, never the viewport.
       Sitting outside it (same as the footer) is what makes this genuinely
       full-width; the inner wrapper below puts the text back on the grid. */
    <section className="relative isolate overflow-hidden border-y border-quest-surface-border">
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        sizes="100vw"
        priority
        aria-hidden
        className="-z-10 object-cover opacity-15"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/30 via-fuchsia-500/15 to-transparent"
      />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="min-h-[96px] sm:min-h-[88px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0, y: -6 }}
              transition={reduced ? { duration: 0 } : { duration: 0.3 }}
            >
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {slide.title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {slide.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-3 flex gap-1.5" aria-hidden>
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === index
                  ? "w-5 bg-interview-accent"
                  : "w-1.5 bg-foreground/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GuestLimitBanner({ delay }: { readonly delay: number }) {
  const reduced = useReducedMotion() ?? false;
  const { t } = useLocale();

  return (
    <motion.div
      variants={riseVariants(reduced)}
      initial="hidden"
      animate="visible"
      custom={delay}
    >
      <GlassCard
        variant="active"
        className="flex items-start gap-3 border-amber-500/40"
      >
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <Lock className="size-4" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-bold text-foreground">
            {formatMessage(t.home.guestLimit.title, {
              count: GUEST_SESSION_LIMIT,
            })}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {t.home.guestLimit.body}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}

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

/**
 * One field, with its specialties as **parallel** role choices.
 *
 * Nothing connects them, because nothing should: Frontend and DevOps are
 * different jobs. A connector here would claim a progression that does not
 * exist — the same mistake the earlier map made between fields.
 */
function FieldSection({
  domain,
  nodes,
  onEnter,
  delay,
}: {
  readonly domain: DomainConfig;
  readonly nodes: readonly ResolvedNode[];
  readonly onEnter: (node: ResolvedNode) => void;
  readonly delay: number;
}) {
  const reduced = useReducedMotion() ?? false;
  const { t } = useLocale();
  const DomainIcon = domain.icon;

  return (
    <motion.section
      variants={riseVariants(reduced)}
      initial="hidden"
      animate="visible"
      custom={delay}
      style={fieldAccent(domain.id)}
    >
      <GlassCard variant="quiet" padded={false} className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`grid size-8 place-items-center rounded-xl text-white ${domain.theme.badgeBg}`}
          >
            <DomainIcon className="size-4" aria-hidden />
          </span>
          <h2 className="text-base font-bold text-interview-accent-text">
            {domain.sectionTitle}
          </h2>
          {/* Once per field, not once per node (§6.2). */}
          {domain.comingSoon && (
            <span className="ml-auto rounded-full bg-quest-locked px-2 py-0.5 text-[10px] font-bold text-quest-locked-foreground">
              {t.home.field.comingSoon}
            </span>
          )}
        </div>

        {/* Three across, so every field reads as one balanced row. */}
        <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {nodes.map((node, index) => (
            <li key={node.specialty.id}>
              <QuestNode
                title={node.specialty.title}
                description={node.specialty.description}
                icon={node.specialty.icon}
                state={node.state}
                difficulty={node.specialty.difficulty}
                bestPercent={node.record?.bestPercent}
                lockedReason={node.lockedReason}
                delay={reduced ? 0 : delay + index * STAGGER.list}
                onActivate={() => onEnter(node)}
              />
            </li>
          ))}
        </ul>
      </GlassCard>
    </motion.section>
  );
}

export default function Home() {
  const router = useRouter();
  const reduced = useReducedMotion() ?? false;
  const { t } = useLocale();
  const guest = useGuestState();
  const [lockNotice, setLockNotice] = useState<string | null>(null);
  const [showAllFields, setShowAllFields] = useState(false);

  const atGuestLimit = guest.loaded && guest.count >= GUEST_SESSION_LIMIT;

  const byField = useMemo(
    () =>
      domains.map((domain) => ({
        domain,
        nodes: domain.specialties.map((specialty) =>
          resolveNode(domain, specialty, guest, atGuestLimit)
        ),
      })),
    [guest, atGuestLimit]
  );

  const activeNode = byField
    .flatMap((field) => field.nodes)
    .find((node) => node.state === "active");

  /* At most three fields up front (§5.2 — one screen, one decision); the rest
     stay behind the "Find some?" button. */
  const HOME_FIELD_LIMIT = 3;
  const visibleFields = showAllFields
    ? byField
    : byField.slice(0, HOME_FIELD_LIMIT);
  const hiddenFieldCount = byField.length - HOME_FIELD_LIMIT;

  function handleEnter(node: ResolvedNode) {
    if (node.state === "locked") {
      // §6.1 — a locked node explains itself rather than doing nothing.
      setLockNotice(node.lockedReason ?? "Chưa thể bắt đầu chuyên môn này.");
      return;
    }
    router.push(`/interview/${node.domain.id}/${node.specialty.id}`);
  }

  /** Header chip → reveal that field, then scroll to it. */
  function handlePickField(domainId: string) {
    setShowAllFields(true);
    requestAnimationFrame(() => {
      document
        .getElementById(`field-${domainId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Ambient field. Fixed and non-scrolling, so the blurred surfaces above
          it composite against something stable (§4.4). */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden bg-gradient-to-b from-violet-100/70 via-transparent to-fuchsia-100/50 dark:from-violet-950/30 dark:to-fuchsia-950/20"
      >
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-interview-accent/15 blur-3xl" />
        <div className="absolute -right-32 top-1/3 size-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative">
        <SiteHeader onPickField={handlePickField} />

        {/* Sibling of <main>, not nested inside it — see the note on
            HeroSlider above for why that's required for a true full-bleed. */}
        <HeroSlider />

        <main className="mx-auto max-w-5xl px-3 pb-24 pt-4 sm:px-4">
          {atGuestLimit && (
            <div className="mt-4">
              <GuestLimitBanner delay={MAP_ENTRY.header} />
            </div>
          )}

          {/* The single primary action (§5.2) — but only for someone who has
              told us their trade by practising it. A newcomer gets no hero
              CTA, because any specialty we picked for them would be a guess
              about their profession. */}
          {activeNode && !atGuestLimit && (
            <div className="mt-4">
              <CurrentTrackCard
                node={activeNode}
                onResume={() => handleEnter(activeNode)}
                delay={MAP_ENTRY.header + 0.06}
              />
            </div>
          )}

          <div className="mt-8">
            <motion.div
              variants={riseVariants(reduced)}
              initial="hidden"
              animate="visible"
              custom={MAP_ENTRY.header + 0.1}
            >
              <h2 className="text-lg font-extrabold text-foreground">
                {activeNode
                  ? t.home.sections.otherFieldsTitle
                  : t.home.sections.chooseFieldTitle}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {activeNode
                  ? t.home.sections.otherFieldsBody
                  : t.home.sections.chooseFieldBody}
              </p>
            </motion.div>

            <div className="mt-4 space-y-4">
              {visibleFields.map(({ domain, nodes }, index) => (
                <div key={domain.id} id={`field-${domain.id}`}>
                  <FieldSection
                    domain={domain}
                    nodes={nodes}
                    onEnter={handleEnter}
                    delay={MAP_ENTRY.stations + index * STAGGER.stations}
                  />
                </div>
              ))}
            </div>

            {!showAllFields && hiddenFieldCount > 0 && (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllFields(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-interview-accent/35 bg-quest-surface px-4 py-2 text-sm font-bold text-interview-accent-text transition-colors hover:bg-interview-accent/10"
                >
                  {t.home.sections.showMore}
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              </div>
            )}
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
    </div>
  );
}
