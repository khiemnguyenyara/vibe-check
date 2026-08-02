"use client";

import { use, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ChatPane } from "@/components/interview/chat-pane";
import { LoginWall } from "@/components/interview/login-wall";
import { SessionSummary } from "@/components/interview/session-summary";
import { useInterviewSession } from "@/components/interview/use-interview-session";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findDomain, findSpecialty } from "@/lib/domains";
import { GUEST_SESSION_LIMIT } from "@/lib/session/storage";
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
  // Bumping this remounts the session engine, which is what actually starts
  // a clean interview — router.refresh() only re-runs the server render and
  // would leave the completed client-side session in place.
  const [runKey, setRunKey] = useState(0);

  const domainConfig = findDomain(domainId);
  const specialtyConfig = findSpecialty(domainId, specialtyId);
  const moduleDef = getModule(domainId);

  if (!domainConfig || !specialtyConfig || !moduleDef) {
    notFound();
  }

  return (
    <InterviewSession
      key={runKey}
      domainLabel={domainConfig.label}
      specialtyLabel={specialtyConfig.label}
      moduleId={moduleDef.id}
      specialtyId={specialtyId}
      moduleDef={moduleDef}
      onExit={() => router.push("/")}
      onRestart={() => setRunKey((current) => current + 1)}
    />
  );
}

/**
 * Split from the route component so the hooks below sit after the
 * notFound() guards — calling hooks above a conditional early return would
 * break the rules of hooks.
 */
function InterviewSession({
  domainLabel,
  specialtyLabel,
  moduleId,
  specialtyId,
  moduleDef,
  onExit,
  onRestart,
}: {
  readonly domainLabel: string;
  readonly specialtyLabel: string;
  readonly moduleId: string;
  readonly specialtyId: string;
  readonly moduleDef: NonNullable<ReturnType<typeof getModule>>;
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
      experienceLevel: "mid",
      focusAreas: [specialtyLabel],
      locale: "vi-VN",
    }),
    [moduleId, specialtyId, specialtyLabel]
  );

  const {
    turns,
    status,
    isFetchingNext,
    isEvaluating,
    error,
    sessionLength,
    interviewCount,
    summary,
    pendingAnswer,
    submitAnswer,
    retry,
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

  // hla.md §4.1 step 3: an unusable module renders an unavailable state
  // rather than throwing at the UI layer.
  if (!moduleDef.interviewService) {
    return (
      <UnavailableDomain
        domainLabel={domainLabel}
        specialtyLabel={specialtyLabel}
        onExit={onExit}
      />
    );
  }

  const Workspace = moduleDef.Workspace;
  const isOverGuestLimit = interviewCount >= GUEST_SESSION_LIMIT;

  return (
    <div className="flex h-dvh flex-col">
      <TopBar
        domainLabel={domainLabel}
        specialtyLabel={specialtyLabel}
        onExit={onExit}
      />

      <div className="flex-1 overflow-hidden">
        {status === "completed" && summary ? (
          <SessionSummary
            summary={summary}
            turns={turns}
            specialtyLabel={specialtyLabel}
            onRestart={onRestart}
            onHome={onExit}
          />
        ) : (
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
              <ChatPane
                title={`${specialtyLabel} Interview`}
                turns={turns}
                isFetchingNext={isFetchingNext}
                isEvaluating={isEvaluating}
                error={error}
                isReadOnly={status !== "in_progress"}
                sessionLength={sessionLength}
                pendingAnswer={pendingAnswer}
                onSubmitAnswer={(answer) => void submitAnswer(answer)}
                onRetry={() => void retry()}
              />
            </div>

            <div
              className={`min-h-0 flex-1 lg:block ${
                mobilePane === "workspace" ? "block" : "hidden"
              }`}
            >
              <Workspace
                context={context}
                status={status}
                onSubmit={handleWorkspaceSubmit}
              />
            </div>
          </div>
        )}
      </div>

      {status === "completed" && isOverGuestLimit && <LoginWall />}
    </div>
  );
}

function TopBar({
  domainLabel,
  specialtyLabel,
  onExit,
}: {
  readonly domainLabel: string;
  readonly specialtyLabel: string;
  readonly onExit: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-neutral-200 bg-white px-4 py-2 dark:border-white/10 dark:bg-neutral-950">
      <button
        type="button"
        onClick={onExit}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Trang chủ
      </button>
      <span className="text-sm text-muted-foreground">
        {domainLabel} / {specialtyLabel}
      </span>
    </div>
  );
}

function UnavailableDomain({
  domainLabel,
  specialtyLabel,
  onExit,
}: {
  readonly domainLabel: string;
  readonly specialtyLabel: string;
  readonly onExit: () => void;
}) {
  return (
    <div className="flex h-dvh flex-col">
      <TopBar
        domainLabel={domainLabel}
        specialtyLabel={specialtyLabel}
        onExit={onExit}
      />
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
