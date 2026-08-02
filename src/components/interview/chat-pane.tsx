"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, RotateCcw, Send } from "lucide-react";

import { ActionBubble } from "@/components/ui/action-bubble";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot/mascot";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { TranscriptTurn } from "@/lib/session/types";

import { EvaluationCard } from "./evaluation-card";

/**
 * The Chat pane is Core-owned: docs/design-system.md §3.2 assigns it to
 * src/app + src/components and explicitly forbids domain modules rendering
 * into it. The bubble styling moved here verbatim from the tech Workspace,
 * which had been holding it in the wrong layer.
 */

interface ChatPaneProps {
  readonly title: string;
  readonly turns: readonly TranscriptTurn[];
  readonly isFetchingNext: boolean;
  readonly isEvaluating: boolean;
  readonly error: string | null;
  readonly isReadOnly: boolean;
  readonly sessionLength: number;
  /** Submitted but not yet graded — rendered optimistically. */
  readonly pendingAnswer: string | null;
  readonly onSubmitAnswer: (answer: string) => void;
  readonly onRetry: () => void;
}

function AiBubble({ content }: { content: string }) {
  return (
    <div className="max-w-[85%] self-start rounded-2xl rounded-tl-sm border border-quest-surface-border bg-quest-surface px-4 py-3 text-sm leading-relaxed text-card-foreground shadow-[0_8px_24px_-12px_var(--quest-glow)]">
      {content}
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="max-w-[85%] self-end whitespace-pre-wrap rounded-2xl rounded-br-sm bg-interview-accent px-4 py-3 text-sm leading-relaxed text-interview-accent-foreground shadow-[0_8px_24px_-12px_var(--quest-glow)]">
      {content}
    </div>
  );
}

function PendingAiBubble() {
  return (
    <div className="flex max-w-[85%] flex-col gap-2 self-start rounded-2xl rounded-tl-sm border border-quest-surface-border bg-quest-surface px-4 py-3 shadow-[0_8px_24px_-12px_var(--quest-glow)]">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="h-3 w-52" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}

function PendingEvaluation() {
  return (
    <div className="flex max-w-[85%] flex-col gap-2 self-start rounded-2xl border-2 border-dashed border-foreground/30 px-4 py-3">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-3 w-44" />
    </div>
  );
}

function ErrorBubble({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex max-w-[85%] flex-col items-start gap-2 self-start rounded-2xl rounded-tl-sm border-2 border-destructive bg-quest-surface px-4 py-3 text-sm text-destructive shadow-[0_8px_24px_-12px_var(--quest-glow)]">
      <span>{message}</span>
      {onRetry && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="h-7 gap-1.5 rounded-full border-2 border-destructive text-xs text-destructive"
        >
          <RotateCcw className="size-3.5" />
          Thử lại
        </Button>
      )}
    </div>
  );
}

export function ChatPane({
  title,
  turns,
  isFetchingNext,
  isEvaluating,
  error,
  isReadOnly,
  sessionLength,
  pendingAnswer,
  onSubmitAnswer,
  onRetry,
}: ChatPaneProps) {
  const [answer, setAnswer] = useState("");

  const isBusy = isFetchingNext || isEvaluating;
  const canSend = !isBusy && !isReadOnly && answer.trim().length > 0;

  const questionsAsked = turns.length;
  const progress =
    sessionLength === 0 ? 0 : Math.min(questionsAsked / sessionLength, 1);

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns, isFetchingNext, isEvaluating, pendingAnswer]);

  function handleSend() {
    if (!canSend) return;
    onSubmitAnswer(answer);
    setAnswer("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-interview-accent/25 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-interview-accent/15 blur-3xl" />
      </div>

      <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-b border-quest-surface-border bg-background/90 px-5 py-4 backdrop-blur-md">
        <h1 className="truncate text-base font-bold tracking-tight sm:text-lg">
          {title}
        </h1>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {/* sessionLength is authoritative from the server and unknown
                until the first response — show a bare count rather than the
                nonsense "Câu 1/0" while it is still 0. */}
            Câu {Math.max(questionsAsked, 1)}
            {sessionLength > 0 ? `/${sessionLength}` : ""}
          </span>
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-interview-accent transition-all duration-500 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
          {turns.map((turn) => (
            <div key={turn.id} className="flex flex-col gap-4">
              <AiBubble content={turn.question.prompt} />
              {turn.answer !== null && <UserBubble content={turn.answer} />}
              {turn.evaluation !== null && (
                <EvaluationCard evaluation={turn.evaluation} />
              )}
            </div>
          ))}
          {/* Held outside the transcript until graded, so a retry replays an
              identical request — see the Session Engine. */}
          {pendingAnswer !== null && (
            <>
              <UserBubble content={pendingAnswer} />
              {isEvaluating && <PendingEvaluation />}
            </>
          )}
          {isFetchingNext && <PendingAiBubble />}
          {error && (
            <ErrorBubble
              message={error}
              onRetry={isReadOnly ? undefined : onRetry}
            />
          )}
          {isReadOnly && (
            <p className="self-center rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-muted-foreground">
              Phiên phỏng vấn đã kết thúc
            </p>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-24 right-4 z-20 hidden min-[380px]:block"
        aria-hidden
      >
        <Mascot
          state={isEvaluating ? "thinking" : isReadOnly ? "resting" : "idle"}
          size={52}
        />
      </div>

      <footer className="relative z-10 shrink-0 border-t border-quest-surface-border bg-background/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md sm:px-8">
        <div className="mx-auto flex w-full max-w-2xl items-end gap-2">
          <Textarea
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Chia sẻ cách bạn giải quyết vấn đề này..."
            disabled={isBusy || isReadOnly}
            className="max-h-40 min-h-12 flex-1 resize-none rounded-sm border border-quest-surface-border bg-background px-3 py-2.5 shadow-none focus-visible:border-interview-accent focus-visible:ring-0"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled
            aria-label="Trả lời bằng giọng nói (sắp ra mắt)"
            className="size-11 shrink-0 rounded-full border border-quest-surface-border bg-background text-foreground/70"
          >
            <Mic className="size-4" />
          </Button>
          <ActionBubble
            state={
              isReadOnly || isBusy ? "disabled" : canSend ? "ready" : "disabled"
            }
            onClick={handleSend}
            aria-label="Gửi câu trả lời"
            breathing={false}
            className="size-11 shrink-0 px-0"
          >
            <Send className="size-4" aria-hidden />
          </ActionBubble>
        </div>
      </footer>
    </div>
  );
}
