"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";

import { ChatPane } from "@/components/interview/chat-pane";
import { getPendingQuestion } from "@/components/interview/current-question";
import { InterviewSessionBar } from "@/components/interview/interview-session-bar";
import {
  parseInterviewLevel,
  toExperienceLevel,
  toInterviewLevel,
  type InterviewLevel,
} from "@/components/interview/level";
import { toWireLocale, type WireLocale } from "@/components/interview/locale";
import { readStoredLocale } from "@/lib/i18n/storage";
import { SessionSummary } from "@/components/interview/session-summary";
import { useInterviewSession } from "@/components/interview/use-interview-session";
import { WorkspacePane } from "@/components/interview/workspace-pane";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findDomain, findSpecialty } from "@/lib/domains";
import { loadActiveSession } from "@/lib/session/storage";
import { getModule } from "@/modules/registry";
import type {
  InterviewSessionContext,
  WorkspaceSubmission,
} from "@/modules/types";

interface InterviewRouteParams {
  domain: string;
  specialty: string;
}

/** Which pane the mobile switcher is showing; ignored at lg and above. */
type MobilePane = "chat" | "workspace";

// This whole route is a Client Component: the module's Workspace requires a
// real onSubmit callback, and functions can't be passed from a Server
// Component to a Client Component as props — only Client-to-Client.
export default function InterviewPage({
  params,
}: {
  params: Promise<InterviewRouteParams>;
}) {
  const { domain: domainId, specialty: specialtyId } = use(params);
  const router = useRouter();

  const domainConfig = findDomain(domainId);
  const specialtyConfig = findSpecialty(domainId, specialtyId);
  const moduleDef = getModule(domainId);

  if (!domainConfig || !specialtyConfig || !moduleDef) {
    notFound();
  }

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <div className="flex min-h-0 flex-1 flex-col">
        <InterviewSession
          domainLabel={domainConfig.label}
          specialtyLabel={specialtyConfig.label}
          moduleId={moduleDef.id}
          specialtyId={specialtyId}
          moduleDef={moduleDef}
          onExit={() => router.push("/")}
        />
      </div>
    </div>
  );
}

/**
 * Split from the route component so the hooks below sit after the
 * notFound() guards — calling hooks above a conditional early return would
 * break the rules of hooks.
 *
 * Gates the level choice before anything below can mount: `useInterviewSession`
 * (inside ActiveInterview) opens the session in a bootstrap effect that fires
 * exactly once, using whatever context it's given at that render — there is no
 * "wait until the level is ready" path inside it. So "level not chosen yet"
 * and "session active" have to be genuinely different mounted components
 * (ActiveInterview only ever mounts once `level` is non-null), not one
 * component that conditionally skips its own hook call.
 *
 * The level itself is chosen earlier — in the popup the coach card opens —
 * and arrives here as a `?level=` query param, not from a picker on this
 * route. A direct visit with no query param and no resumable session has no
 * way to know the level, so it bounces back home instead of guessing one.
 */
function InterviewSession({
  domainLabel,
  specialtyLabel,
  moduleId,
  specialtyId,
  moduleDef,
  onExit,
}: {
  readonly domainLabel: string;
  readonly specialtyLabel: string;
  readonly moduleId: string;
  readonly specialtyId: string;
  readonly moduleDef: NonNullable<ReturnType<typeof getModule>>;
  readonly onExit: () => void;
}) {
  const searchParams = useSearchParams();

  /**
   * The two values `ActiveInterview` needs before it can mount, held as one
   * slot rather than two `useState` calls.
   *
   * They're not symmetric — `level` may resolve synchronously from the URL
   * on the very first render, while `locale` is *always* resolved later, in
   * an effect (see the comment below) — so this can't be a single
   * `T | null`; it has to be an object with two independently-nullable
   * fields. What one slot still buys over two: the resumable branch below
   * sets both fields in a single update instead of two sequential
   * `setState` calls, and a future third bootstrap value is one field added
   * to `Bootstrap` and one `useState` to remember, not a second one to
   * introduce from scratch.
   */
  const [bootstrap, setBootstrap] = useState<Bootstrap>(() => ({
    level: parseInterviewLevel(searchParams.get("level")),
    locale: null,
  }));

  // Bumped on restart to force a fresh `ActiveInterview` mount (and with it
  // a fresh `useInterviewSession` bootstrap) at the *same* level — there is
  // no picker on this route anymore to ask again, so "Luyện lại" just
  // re-runs the session it already knows the difficulty for.
  const [sessionEpoch, setSessionEpoch] = useState(0);

  // Resuming a genuinely in-progress session must override the query param:
  // the level is already baked into that session's question ids (tech/server
  // keys its question bank by level), so trusting the URL here would risk
  // drawing later questions from a different bank mid-session. Read-in-effect,
  // same hydration-safe idiom use-interview-session.ts's own bootstrap effect
  // uses — the server has no sessionStorage, so this can't run during render.
  //
  // `locale` is resolved here unconditionally, not just on the resumable
  // path: the honest value is never available during render either way —
  // `LocaleProvider` renders its default on the server and first paint, then
  // restores the stored preference in an effect, and child effects run
  // before parent ones, so reading `useLocale()` here would hand the session
  // bootstrap "vi" a beat before the provider swapped to "en".
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!moduleDef.interviewService) return;
    const stored = loadActiveSession();
    const isResumable =
      stored !== null &&
      stored.moduleId === moduleId &&
      stored.specialtyId === specialtyId &&
      stored.completedAt === null &&
      stored.turns.length > 0;
    if (isResumable) {
      setBootstrap({
        level: toInterviewLevel(stored.experienceLevel),
        // A resumed session keeps the language it started in, overriding the
        // current UI preference. Its earlier turns are already persisted in
        // that language, and the server re-resolves their rubric per request —
        // switching now would grade those answers against a translation.
        locale: stored.locale,
      });
      return;
    }
    setBootstrap((prev) => ({
      ...prev,
      locale: toWireLocale(readStoredLocale() ?? "vi"),
    }));
  }, [moduleId, specialtyId, moduleDef.interviewService]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // No level from the URL and nothing to resume — this route was reached
  // without ever going through the coach-card popup, so send it back rather
  // than rendering a picker here. Only `level` is checked: `locale` above
  // always resolves to something, it never has a "give up" case of its own.
  useEffect(() => {
    if (bootstrap.level !== null) return;
    onExit();
  }, [bootstrap.level, onExit]);

  // hla.md §4.1 step 3: an unusable module renders an unavailable state
  // rather than throwing at the UI layer. Checked before the level guard so
  // a domain with no interviewService (e.g. marketing) never bounces home.
  if (!moduleDef.interviewService) {
    return <UnavailableDomain domainLabel={domainLabel} onExit={onExit} />;
  }

  if (bootstrap.level === null || bootstrap.locale === null) {
    return (
      <div className="grid h-full place-items-center px-6 text-center text-sm text-muted-foreground">
        Đang chuyển hướng…
      </div>
    );
  }

  return (
    <ActiveInterview
      key={sessionEpoch}
      specialtyLabel={specialtyLabel}
      moduleId={moduleId}
      specialtyId={specialtyId}
      moduleDef={moduleDef}
      level={bootstrap.level}
      locale={bootstrap.locale}
      onExit={onExit}
      onRestart={() => setSessionEpoch((epoch) => epoch + 1)}
    />
  );
}

interface Bootstrap {
  readonly level: InterviewLevel | null;
  readonly locale: WireLocale | null;
}

function ActiveInterview({
  specialtyLabel,
  moduleId,
  specialtyId,
  moduleDef,
  level,
  locale,
  onExit,
  onRestart,
}: {
  readonly specialtyLabel: string;
  readonly moduleId: string;
  readonly specialtyId: string;
  readonly moduleDef: NonNullable<ReturnType<typeof getModule>>;
  readonly level: InterviewLevel;
  readonly locale: WireLocale;
  readonly onExit: () => void;
  readonly onRestart: () => void;
}) {
  const [mobilePane, setMobilePane] = useState<MobilePane>("chat");

  const context = useMemo<InterviewSessionContext>(
    () => ({
      // Placeholder. The Session Engine owns the real per-session UUID and
      // substitutes it before anything crosses the wire; this value only
      // ever reaches getSystemPrompt, which must stay a pure function of
      // its context and therefore cannot depend on a random id.
      sessionId: `${moduleId}:${specialtyId}`,
      experienceLevel: toExperienceLevel(level),
      focusAreas: [specialtyLabel],
      locale,
    }),
    [moduleId, specialtyId, specialtyLabel, level, locale]
  );

  const {
    turns,
    status,
    isFetchingNext,
    isEvaluating,
    error,
    sessionLength,
    summary,
    pendingAnswer,
    startedAt,
    submitAnswer,
    retry,
    restart,
  } = useInterviewSession({
    context,
    moduleId,
    specialtyId,
    service: moduleDef.interviewService,
  });

  const handleWorkspaceSubmit = useCallback((submission: WorkspaceSubmission) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[InterviewPage] workspace submission:", submission);
    }
  }, []);

  // The scratchpad is only relevant when the question being asked calls for
  // one — a multiple-choice pick or a pure discussion question never needs
  // it. Defaults to HIDDEN while no question has arrived yet (e.g. the
  // initial mock-latency gap): defaulting to visible-then-yanked-away reads
  // as broken (a pane flashing for under a second), while appearing once a
  // practice question actually loads reads as an extra tool showing up —
  // the safer direction to default in. Core's own layout call, not
  // something the module opts into.
  const pendingQuestion = getPendingQuestion(turns);
  const showWorkspace =
    pendingQuestion?.type === "open" && pendingQuestion.requiresPractice;

  const chatPane = (
    <ChatPane
      title={`${specialtyLabel} Interview`}
      domainId={moduleId}
      avatarSeed={`${moduleId}-${specialtyId}`}
      turns={turns}
      isFetchingNext={isFetchingNext}
      isEvaluating={isEvaluating}
      error={error}
      isReadOnly={status !== "in_progress"}
      sessionLength={sessionLength}
      pendingAnswer={pendingAnswer}
      onSubmitAnswer={(answer) => void submitAnswer(answer)}
      onRetry={() => void retry()}
      onAbandon={() => void restart()}
    />
  );

  let body: React.ReactNode;
  if (status === "completed" && summary) {
    body = (
      <SessionSummary
        summary={summary}
        turns={turns}
        specialtyLabel={specialtyLabel}
        onRestart={onRestart}
        onHome={onExit}
      />
    );
  } else if (showWorkspace) {
    body = (
      /* Each pane is rendered exactly once and shown/hidden with CSS.
         Rendering a separate mobile and desktop tree would duplicate
         both panes in the DOM, giving the chat two independent drafts
         and the workspace two scratchpads. The Tabs primitive drives the
         mobile switcher per design-system.md §3.1, which also forbids
         stacking the panes vertically — the workspace needs real height. */
      <div className="flex h-full flex-col lg:grid lg:grid-cols-[2fr_3fr] lg:flex-row">
        <Tabs
          value={mobilePane}
          onValueChange={(value) => setMobilePane(value as MobilePane)}
          className="shrink-0 px-4 pt-3 pb-1 lg:hidden"
        >
          <TabsList>
            <TabsTrigger value="chat">Hội thoại</TabsTrigger>
            <TabsTrigger value="workspace">Làm bài</TabsTrigger>
          </TabsList>
        </Tabs>

        <div
          className={`min-h-0 flex-1 lg:block lg:border-r lg:border-quest-surface-border ${
            mobilePane === "chat" ? "block" : "hidden"
          }`}
        >
          {chatPane}
        </div>

        <div
          className={`min-h-0 flex-1 lg:block ${
            mobilePane === "workspace" ? "block" : "hidden"
          }`}
        >
          <WorkspacePane
            context={context}
            status={status}
            onSubmit={handleWorkspaceSubmit}
          />
        </div>
      </div>
    );
  } else {
    // No mobile Tabs switcher — there is nothing to switch to.
    body = <div className="h-full">{chatPane}</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <InterviewSessionBar
        startedAt={startedAt}
        endedAt={summary?.completedAt ?? null}
        onExit={onExit}
      />

      <div className="flex-1 overflow-hidden">{body}</div>
    </div>
  );
}

function UnavailableDomain({
  domainLabel,
  onExit,
}: {
  readonly domainLabel: string;
  readonly onExit: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <InterviewSessionBar label={domainLabel} onExit={onExit} />

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-sm rounded-2xl border border-quest-surface-border bg-card p-6 text-center shadow-[0_8px_24px_-12px_var(--quest-glow)]">
          <h2 className="text-base font-bold">Lĩnh vực chưa khả dụng</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Bộ câu hỏi cho {domainLabel} đang được hoàn thiện. Hãy thử một lĩnh
            vực khác trong lúc chờ nhé.
          </p>
        </div>
      </div>
    </div>
  );
}
