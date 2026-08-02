"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Lock, Play, Sparkles, Trophy } from "lucide-react";

import { QuestNode, type QuestNodeState } from "@/components/quest/quest-node";
import { ActionBubble } from "@/components/ui/action-bubble";
import { GlassCard } from "@/components/ui/glass-card";
import { domains, type DomainConfig, type Specialty } from "@/lib/domains";
import { MAP_ENTRY, STAGGER, riseVariants } from "@/lib/motion/tokens";
import {
  buildProgressIndex,
  currentTrack,
  progressKey,
  type CurrentTrack,
  type ProgressIndex,
  type SpecialtyProgress,
} from "@/lib/session/progress";
import {
  GUEST_SESSION_LIMIT,
  loadHistory,
  readInterviewCount,
} from "@/lib/session/storage";

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

interface GuestState {
  readonly count: number;
  readonly progress: ProgressIndex;
  readonly track: CurrentTrack | null;
  readonly loaded: boolean;
}

const EMPTY_GUEST: GuestState = {
  count: 0,
  progress: new Map(),
  track: null,
  loaded: false,
};

/**
 * Storage is read in an effect, never during render: the server has no
 * localStorage, so a render-time read desyncs hydration and flashes the
 * wrong node states. `loaded` keeps the first paint neutral.
 */
function useGuestState(): GuestState {
  const [state, setState] = useState<GuestState>(EMPTY_GUEST);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const history = loadHistory();
    setState({
      count: readInterviewCount(),
      progress: buildProgressIndex(history),
      track: currentTrack(history),
      loaded: true,
    });
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return state;
}

interface ResolvedNode {
  readonly domain: DomainConfig;
  readonly specialty: Specialty;
  readonly state: QuestNodeState;
  readonly record?: SpecialtyProgress;
  readonly lockedReason?: string;
}

/**
 * Assign a state to one specialty.
 *
 * `active` means "the specialty you are currently practising" — the one you
 * last sat a session for. It is not "the next step in a sequence", because
 * there is no sequence: Frontend and Backend are different jobs, not
 * consecutive levels of one.
 */
function resolveNode(
  domain: DomainConfig,
  specialty: Specialty,
  guest: GuestState,
  atGuestLimit: boolean
): ResolvedNode {
  const record = guest.progress.get(progressKey(domain.id, specialty.id));

  if (domain.comingSoon) {
    return {
      domain,
      specialty,
      state: "locked",
      lockedReason: "Nội dung đang được hoàn thiện.",
    };
  }

  if (atGuestLimit) {
    return {
      domain,
      specialty,
      state: "locked",
      record,
      lockedReason: "Đã dùng hết lượt miễn phí.",
    };
  }

  const isCurrent =
    guest.track?.moduleId === domain.id &&
    guest.track?.specialtyId === specialty.id;

  if (isCurrent) return { domain, specialty, state: "active", record };
  if (record?.mastered) return { domain, specialty, state: "mastered", record };
  if (record) return { domain, specialty, state: "completed", record };
  return { domain, specialty, state: "available" };
}

/** Field accent overrides, applied on a section root (§3.1). */
function fieldAccent(domainId: string): React.CSSProperties {
  return {
    "--interview-accent": `var(--station-accent-${domainId}, var(--interview-accent))`,
    "--interview-accent-text": `var(--station-accent-${domainId}-text, var(--station-accent-${domainId}, var(--interview-accent-text)))`,
  } as React.CSSProperties;
}

/**
 * Blurred sticky header: brand row, then the career categories as a single
 * scrollable rail so the fields are reachable before any scrolling.
 */
function NavBar({
  onPickField,
}: {
  readonly onPickField: (domainId: string) => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-quest-surface-border bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto max-w-5xl px-3 sm:px-4">
        <div className="flex items-center gap-2.5 py-2.5">
          <Image
            src="/vibe_check.jpg"
            alt="Vibe Check"
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-xl object-cover"
            priority
          />
          <span className="text-base font-extrabold tracking-tight text-foreground">
            Vibe Check
          </span>
        </div>

        <nav
          aria-label="Lĩnh vực nghề nghiệp"
          className="-mx-3 flex gap-1.5 overflow-x-auto px-3 pb-2 sm:-mx-4 sm:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {domains.map((domain) => {
            const Icon = domain.icon;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => onPickField(domain.id)}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-quest-surface-border bg-quest-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-interview-accent/40 hover:text-interview-accent-text"
              >
                <Icon className="size-3.5" aria-hidden />
                {domain.sectionTitle}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

/** Hero copy — one line per slide, rotated on a timer. */
const HERO_SLIDES = [
  {
    title: "Luyện phỏng vấn cùng AI",
    body: "Câu hỏi bám sát đúng công việc bạn đang ứng tuyển.",
  },
  {
    title: "Chấm điểm ngay sau mỗi câu",
    body: "Biết ngay điểm mạnh và phần kiến thức còn thiếu.",
  },
  {
    title: "Theo dõi tiến bộ từng phiên",
    body: "Điểm cao nhất của bạn được lưu lại qua các lần luyện.",
  },
] as const;

/** Auto-advancing hero. Fade only — no carousel controls, no drag. */
function HeroSlider() {
  const reduced = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % HERO_SLIDES.length),
      4500
    );
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[index];

  return (
    <GlassCard
      variant="active"
      className="overflow-hidden bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-transparent"
    >
      <div className="min-h-[92px] sm:min-h-[80px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: -6 }}
            transition={reduced ? { duration: 0 } : { duration: 0.3 }}
          >
            <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              {slide.title}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{slide.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex gap-1.5" aria-hidden>
        {HERO_SLIDES.map((_, i) => (
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
    </GlassCard>
  );
}

function GuestLimitBanner({ delay }: { readonly delay: number }) {
  const reduced = useReducedMotion() ?? false;

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
            Bạn đã dùng hết {GUEST_SESSION_LIMIT} phiên miễn phí
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Đăng nhập để tiếp tục luyện tập không giới hạn và giữ lại toàn bộ
            tiến độ. Tính năng đăng nhập sẽ sớm ra mắt.
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
          Chuyên môn của bạn
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
                Điểm cao nhất
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
            <p className="text-xs font-medium text-muted-foreground">Số phiên</p>
            <p className="text-sm font-extrabold tabular-nums text-foreground">
              {attempts}
            </p>
          </div>
        </div>

        {node.record?.mastered && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-quest-complete/15 px-2.5 py-1 text-xs font-bold text-quest-complete">
            <Trophy className="size-3.5" aria-hidden />
            Bạn đã thành thạo chuyên môn này
          </p>
        )}

        <div className="mt-4">
          <ActionBubble
            icon={<Play className="size-4" aria-hidden />}
            onClick={onResume}
          >
            Luyện tiếp {node.specialty.title}
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
              Sắp ra mắt
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
        <NavBar onPickField={handlePickField} />

        <main className="mx-auto max-w-5xl px-3 pb-24 pt-5 sm:px-4">
          <HeroSlider />

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
                {activeNode ? "Lĩnh vực khác" : "Chọn chuyên môn của bạn"}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {activeNode
                  ? "Mỗi lĩnh vực là một hướng nghề riêng — chỉ chọn nếu bạn muốn luyện thêm mảng khác."
                  : "Chọn đúng công việc bạn đang ứng tuyển để câu hỏi sát với thực tế."}
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
                  Find some?
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

        <footer className="border-t border-quest-surface-border">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-3 py-8 text-center sm:px-4">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5" aria-hidden />
              Luyện phỏng vấn cùng AI
            </span>
            <p className="text-xs text-muted-foreground">© 2026 Vibe Check</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
