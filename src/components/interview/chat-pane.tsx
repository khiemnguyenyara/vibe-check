"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Mic, RefreshCw, RotateCcw, Send } from "lucide-react";

import { ActionBubble } from "@/components/ui/action-bubble";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { fieldAccent } from "@/components/home/field-accent";
import { useCharacterReaction } from "@/lib/hooks/useCharacterReaction";
import { personaAvatar } from "@/lib/avatar";
import { SPRING } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";
import type { TranscriptTurn } from "@/lib/session/types";

import { getPendingQuestion } from "./current-question";
import {
  chatPaneStyles,
  optionButtonVariants,
} from "./chat-pane.styles";

/** Lives shown as hearts (Duolingo-style) — a wrong/weak answer costs one.
 * Purely a client-side motivational cue: it never ends the session early or
 * changes what gets sent to the server, so it can't desync from the
 * server-authoritative SessionStatus / retry contract. */
const MAX_HEARTS = 3;
/** Below this score ratio, an answer counts as a "miss" for the hearts cue. */
const HEART_LOSS_THRESHOLD = 0.5;

function countHearts(turns: readonly TranscriptTurn[]): number {
  const misses = turns.reduce((count, turn) => {
    if (!turn.evaluation) return count;
    const { score, maxScore } = turn.evaluation;
    const ratio = maxScore === 0 ? 0 : score / maxScore;
    return ratio < HEART_LOSS_THRESHOLD ? count + 1 : count;
  }, 0);
  return Math.max(0, MAX_HEARTS - misses);
}


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
    <div className={chatPaneStyles.avatar}>
      <Image
        src={persona.src}
        alt=""
        fill
        sizes="36px"
        className={cn(chatPaneStyles.avatarImage, persona.className)}
      />
    </div>
  );
}

function AiBubble({ content }: { content: string }) {
  return <div className={chatPaneStyles.aiBubble}>{content}</div>;
}

function UserBubble({ content }: { content: string }) {
  return <div className={chatPaneStyles.userBubble}>{content}</div>;
}

/**
 * Multiple-choice options, rendered where a free-text answer bubble would
 * otherwise go. Interactive only for the trailing pending turn; read-only
 * and highlighting the chosen option for past turns. The check glyph is the
 * real selected-state signal, not the fill color alone (§11 colour
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
    <div className={chatPaneStyles.optionsList}>
      {options.map((option) => {
        const isSelected = selectedAnswer === option;
        return (
          <motion.button
            key={option}
            type="button"
            disabled={!interactive}
            onClick={() => onSelect(option)}
            aria-pressed={isSelected}
            whileTap={interactive ? { scale: 0.98, y: 1 } : undefined}
            transition={SPRING.press}
            className={optionButtonVariants({
              interactive,
              selected: isSelected,
            })}
          >
            <span className={chatPaneStyles.optionLabel}>{option}</span>
            {isSelected && (
              <span className={chatPaneStyles.optionCheckBadge}>
                <Check className="size-3.5" aria-hidden />
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function PendingAiBubble() {
  return (
    <div className={chatPaneStyles.pendingAiBubble}>
      <Skeleton className="h-3 w-40" />
      <Skeleton className="h-3 w-52" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}

function PendingEvaluation() {
  return (
    <div className={chatPaneStyles.pendingEvaluation}>
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
    <div className={chatPaneStyles.errorBubble}>
      <span>{message}</span>
      {(onRetry || onAbandon) && (
        <div className={chatPaneStyles.errorActions}>
          {onRetry && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onRetry}
              className={chatPaneStyles.errorRetryButton}
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
              className={chatPaneStyles.errorAbandonButton}
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
  title: _title,
  onAbandon,
  domainId,
  avatarSeed,
  turns,
  isFetchingNext,
  isEvaluating,
  error,
  isReadOnly,
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

  const _hearts = useMemo(() => countHearts(turns), [turns]);

  const { reaction: _reaction, correct, incorrect } = useCharacterReaction();
  const gradedCountRef = useRef(0);
  useEffect(() => {
    const graded = turns.filter((turn) => turn.evaluation).length;
    if (graded > gradedCountRef.current) {
      const latest = [...turns].reverse().find((turn) => turn.evaluation)
        ?.evaluation;
      if (latest) {
        const ratio = latest.maxScore === 0 ? 0 : latest.score / latest.maxScore;
        // A visual-only nudge on the mascot, mirroring the hearts cue above —
        // never surfaces the score/text itself (that stays out of ChatPane
        // by design, see InterviewHeader's doc comment).
        if (ratio < HEART_LOSS_THRESHOLD) incorrect();
        else correct();
      }
    }
    gradedCountRef.current = graded;
  }, [turns, correct, incorrect]);
  // isBusy overrides the reaction pulse: thinking is a live state, not a
  // fire-once cue, so it must track isBusy directly rather than the timed
  // reaction from useCharacterReaction.
  const _mascotReaction = isBusy ? "thinking" : _reaction;

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
    <div className={chatPaneStyles.root} style={fieldAccent(domainId)}>
      <div className={chatPaneStyles.scrollArea}>
        <div className={chatPaneStyles.transcript}>
          {turns.map((turn) => {
            const isPending = turn.answer === null;
            return (
              <div key={turn.id} className={chatPaneStyles.turn}>
                <div className={chatPaneStyles.questionRow}>
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
                {/* No EvaluationCard here on purpose — Duolingo-style flow:
                    the candidate finds out how they did on SessionSummary
                    once the interview ends, not turn-by-turn. */}
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
            <div className={chatPaneStyles.questionRow}>
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
            <p className={chatPaneStyles.readOnlyBadge}>
              Cuộc phỏng vấn đã kết thúc
            </p>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <footer className={chatPaneStyles.footer}>
        <div className={chatPaneStyles.footerInner}>
          <div className={chatPaneStyles.controlsRow}>
            {isMultipleChoice ? (
              <p className={chatPaneStyles.optionHint}>
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
                  className={chatPaneStyles.textarea}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled
                  aria-label="Trả lời bằng giọng nói (sắp ra mắt)"
                  className={chatPaneStyles.micButton}
                >
                  <Mic className="size-4" />
                </Button>
              </>
            )}
          </div>
          <ActionBubble
            state={
              isReadOnly || isBusy ? "disabled" : canSend ? "ready" : "disabled"
            }
            onClick={handleSend}
            aria-label="Gửi câu trả lời"
            icon={<Send className="size-4" aria-hidden />}
            breathing={false}
            className={chatPaneStyles.submitButton}
          >
            Gửi câu trả lời
          </ActionBubble>
        </div>
      </footer>
    </div>
  );
}
