"use client";

import { CircleCheck, Lightbulb } from "lucide-react";

import type { AnswerEvaluation } from "@/lib/session/types";

/**
 * US2 — instant scoring and knowledge-gap analysis, rendered inline right
 * after the answer it grades. Gaps are the actionable half of the story, so
 * they get equal visual weight to strengths rather than a footnote.
 */

function scoreTone(ratio: number): string {
  if (ratio >= 0.8) return "text-emerald-600 dark:text-emerald-400";
  if (ratio >= 0.5) return "text-amber-600 dark:text-amber-400";
  return "text-destructive";
}

export function EvaluationCard({
  evaluation,
}: {
  readonly evaluation: AnswerEvaluation;
}) {
  const { score, maxScore, summary, strengths, knowledgeGaps } = evaluation;
  const ratio = maxScore === 0 ? 0 : score / maxScore;

  return (
    <section
      aria-label="Đánh giá câu trả lời"
      className="max-w-[85%] self-start rounded-2xl border border-quest-surface-border bg-quest-surface px-4 py-3 shadow-[0_8px_24px_-12px_var(--quest-glow)]"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Đánh giá
        </span>
        <span className={`text-lg font-extrabold ${scoreTone(ratio)}`}>
          {score}
          <span className="text-sm font-semibold text-muted-foreground">
            /{maxScore}
          </span>
        </span>
      </div>

      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-foreground/10">
        <div
          className="h-full rounded-full bg-interview-accent transition-all duration-500 ease-out"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-card-foreground">
        {summary}
      </p>

      {strengths.length > 0 && (
        <div className="mt-3">
          <h4 className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CircleCheck className="size-3.5" />
            Đã đề cập
          </h4>
          <ul className="mt-1.5 space-y-1">
            {strengths.map((point) => (
              <li
                key={point}
                className="text-xs leading-relaxed text-muted-foreground"
              >
                • {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {knowledgeGaps.length > 0 && (
        <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-950/30">
          <h4 className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
            <Lightbulb className="size-3.5" />
            Còn thiếu
          </h4>
          <ul className="mt-1.5 space-y-1">
            {knowledgeGaps.map((gap) => (
              <li
                key={gap}
                className="text-xs leading-relaxed text-amber-900 dark:text-amber-200"
              >
                • {gap}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
