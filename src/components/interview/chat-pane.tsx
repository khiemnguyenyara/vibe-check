"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Mic, RefreshCw, RotateCcw, Send } from "lucide-react";

import { ActionBubble } from "@/components/ui/action-bubble";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { personaAvatar } from "@/lib/avatar";
import { cn } from "@/lib/utils";
import type { TranscriptTurn } from "@/lib/session/types";

import { getPendingQuestion } from "./current-question";
import { EvaluationCard } from "./evaluation-card";

/**
 * The Chat pane is Core-owned: docs/design-system.md §3.2 assigns it to
 * src/app + src/components and explicitly forbids domain modules rendering
 * into it. The bubble styling moved here verbatim from the tech Workspace,
 * which had been holding it in the wrong layer.
 */

interface ChatPaneProps {
  readonly title: string;
  /** See `useInterviewSession`'s `restart` — offered on every error, next to
   * retry, because not every failure is one a retry can fix. */
  readonly onAbandon: () => void;
  /** Picks the field's illustrated mentor (Dok for `tech`). Fields without a
   * drawn character fall back to `avatarSeed`. */
  readonly domainId: string;
  /** Seeds the fallback avatar for fields with no character yet — same seed
   * CoachCard uses, so it's the same face the candidate saw on the home page. */
  readonly avatarSeed: string;
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

/**
 * The interviewer's face beside their own bubbles.
 *
 * Shows the field's own mentor when one is drawn (Dok for `tech`), otherwise
 * the seeded fallback — see `@/lib/avatar`. `alt=""` because the avatar
 * repeats beside every interviewer message: naming it would make a screen
 * reader announce the character before each bubble, ahead of the text that
 * actually carries the content.
 */
function PersonaAvatar({
  domainId,
  seed,
}: {
  readonly domainId: string;
  readonly seed: string;
}) {
  const persona = personaAvatar(domainId, seed);

  return (
    <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-quest-surface-border bg-quest-surface">
      <Image
        src={persona.src}
        alt=""
        fill
        sizes="32px"
        className={cn("object-cover", persona.className)}
      />
    </div>
  );
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

/**
 * Multiple-choice options, rendered where a free-text answer bubble would
 * otherwise go. Interactive only for the trailing pending turn; read-only
 * and highlighting the chosen option for past turns. The check glyph is the
 * real selected-state signal, not the border color alone (§11 colour
 * independence — same reasoning level-picker.tsx follows for its cards).
 */
function OptionsList({
  options,
  selectedAnswer,
  interactive,
  onSelect,
}: {
  readonly options: readonly string[];
  readonly selectedAnswer: string | null;
  readonly interactive: boolean;
  readonly onSelect: (option: string) => void;
}) {
  return (
    <div className="flex max-w-[85%] flex-col gap-2 self-start">
      {options.map((option) => {
        const isSelected = selectedAnswer === option;
        return (
          <button
            key={option}
            type="button"
            disabled={!interactive}
            onClick={() => onSelect(option)}
            aria-pressed={isSelected}
            className={cn(
              "flex items-center justify-between gap-2 rounded-2xl border p-3 text-left text-sm",
              "outline-none transition-[box-shadow,transform,border-color]",
              "focus-visible:ring-2 focus-visible:ring-interview-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "motion-reduce:transition-none",
              "border-quest-surface-border bg-quest-surface",
              interactive &&
                "hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-10px_var(--quest-glow)] motion-reduce:hover:translate-y-0",
              !interactive && "cursor-default",
              isSelected &&
                "border-interview-accent/50 shadow-[0_10px_30px_-12px_var(--quest-glow)]"
            )}
          >
            <span className="text-card-foreground">{option}</span>
            {isSelected && (
              <Check
                className="size-4 shrink-0 text-interview-accent-text"
                aria-hidden
              />
            )}
          </button>
        );
      })}
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
  onAbandon,
}: {
  message: string;
  onRetry?: () => void;
  /** Not every error is one `onRetry` can fix — see `onAbandon`'s doc on
   * `ChatPaneProps`. Shares `onRetry`'s undefined-when-read-only gating. */
  onAbandon?: () => void;
}) {
  return (
    <div className="flex max-w-[85%] flex-col items-start gap-2 self-start rounded-2xl rounded-tl-sm border-2 border-destructive bg-quest-surface px-4 py-3 text-sm text-destructive shadow-[0_8px_24px_-12px_var(--quest-glow)]">
      <span>{message}</span>
      {(onRetry || onAbandon) && (
        <div className="flex items-center gap-2">
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
          {onAbandon && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onAbandon}
              className="h-7 gap-1.5 rounded-full text-xs text-destructive/70 hover:text-destructive"
            >
              <RefreshCw className="size-3.5" />
              Bắt đầu lại
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function ChatPane({
  title,
  onAbandon,
  domainId,
  avatarSeed,
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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const pendingQuestion = getPendingQuestion(turns);
  const isMultipleChoice = pendingQuestion?.type === "multiple_choice";

  const isBusy = isFetchingNext || isEvaluating;
  const canSend =
    !isBusy &&
    !isReadOnly &&
    (isMultipleChoice ? selectedOption !== null : answer.trim().length > 0);

  const questionsAsked = turns.length;
  const progress =
    sessionLength === 0 ? 0 : Math.min(questionsAsked / sessionLength, 1);

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns, isFetchingNext, isEvaluating, pendingAnswer]);

  function handleSend() {
    if (!canSend) return;
    if (isMultipleChoice) {
      if (!selectedOption) return;
      onSubmitAnswer(selectedOption);
      setSelectedOption(null);
    } else {
      onSubmitAnswer(answer);
      setAnswer("");
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
          {turns.map((turn) => {
            const isPending = turn.answer === null;
            return (
              <div key={turn.id} className="flex flex-col gap-4">
                <div className="flex items-start gap-2">
                  <PersonaAvatar domainId={domainId} seed={avatarSeed} />
                  <AiBubble content={turn.question.prompt} />
                </div>
                {turn.question.type === "multiple_choice" ? (
                  <OptionsList
                    options={turn.question.options}
                    selectedAnswer={isPending ? selectedOption : turn.answer}
                    interactive={isPending && !isReadOnly && !isBusy}
                    onSelect={setSelectedOption}
                  />
                ) : (
                  turn.answer !== null && <UserBubble content={turn.answer} />
                )}
                {turn.evaluation !== null && (
                  <EvaluationCard evaluation={turn.evaluation} />
                )}
              </div>
            );
          })}
          {/* Held outside the transcript until graded, so a retry replays an
              identical request — see the Session Engine. */}
          {pendingAnswer !== null && (
            <>
              {pendingQuestion?.type === "multiple_choice" ? (
                <OptionsList
                  options={pendingQuestion.options}
                  selectedAnswer={pendingAnswer}
                  interactive={false}
                  onSelect={() => {}}
                />
              ) : (
                <UserBubble content={pendingAnswer} />
              )}
              {isEvaluating && <PendingEvaluation />}
            </>
          )}
          {isFetchingNext && (
            <div className="flex items-start gap-2">
              <PersonaAvatar domainId={domainId} seed={avatarSeed} />
              <PendingAiBubble />
            </div>
          )}
          {error && (
            <ErrorBubble
              message={error}
              onRetry={isReadOnly ? undefined : onRetry}
              onAbandon={isReadOnly ? undefined : onAbandon}
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

      <footer className="relative z-10 shrink-0 border-t border-quest-surface-border bg-background p-4 sm:px-8">
        <div className="mx-auto flex w-full max-w-2xl items-end gap-2">
          {isMultipleChoice ? (
            <p className="flex min-h-12 flex-1 items-center text-sm text-muted-foreground">
              Chọn một đáp án ở trên rồi bấm gửi.
            </p>
          ) : (
            <>
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
            </>
          )}
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
