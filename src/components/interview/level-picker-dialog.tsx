"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

import { fieldAccent } from "@/components/home/field-accent";
import { ActionBubble } from "@/components/ui/action-bubble";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { INTERVIEW_LEVELS, type InterviewLevel } from "./level";

/**
 * Level choice, now a popup off the coach card instead of its own page in
 * the interview route — picking a specialty and picking its difficulty are
 * one motion, and the interview route only ever mounts once both are known.
 */
export function LevelPickerDialog({
  open,
  domainId,
  specialtyLabel,
  onOpenChange,
  onConfirm,
}: {
  readonly open: boolean;
  /** Tints the dialog with this domain's accent — see fieldAccent's doc
   *  comment for why DialogContent needs it applied directly. */
  readonly domainId: string;
  readonly specialtyLabel: string;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: (level: InterviewLevel) => void;
}) {
  const [selected, setSelected] = useState<InterviewLevel | null>(null);

  // Both call sites (FieldView, GetStartedDialog) reuse one long-lived
  // instance across different specialties rather than remounting per pick —
  // without this, confirming would silently reuse whatever level was left
  // selected from the last specialty this dialog was opened for. A `key`
  // remount would avoid the effect, but risks skipping the entrance
  // animation on a freshly-remounted-already-open dialog.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (open) setSelected(null);
  }, [open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" style={fieldAccent(domainId)}>
        <DialogTitle className="text-base font-extrabold text-foreground">
          Chọn độ khó buổi luyện tập
        </DialogTitle>
        <p className="-mt-2 text-xs text-muted-foreground">
          Độ khó sẽ quyết định mức độ câu hỏi mentor đặt ra cho {specialtyLabel}{" "}
          trong suốt buổi luyện này.
        </p>

        <div className="grid gap-2.5 sm:grid-cols-3">
          {INTERVIEW_LEVELS.map(({ level, label, blurb, icon: Icon }) => {
            const isSelected = selected === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => setSelected(level)}
                aria-pressed={isSelected}
                className={cn(
                  "group relative flex flex-col items-start gap-2 rounded-2xl border p-3 text-left",
                  "outline-none transition-[box-shadow,transform,border-color]",
                  "focus-visible:ring-2 focus-visible:ring-interview-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "motion-reduce:transition-none",
                  "border-quest-surface-border bg-quest-surface hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-10px_var(--quest-glow)] motion-reduce:hover:translate-y-0",
                  isSelected &&
                    "border-interview-accent/50 shadow-[0_10px_30px_-12px_var(--quest-glow)]"
                )}
              >
                <span className="flex w-full items-center justify-between">
                  <Icon
                    className="size-5 text-interview-accent-text"
                    aria-hidden
                  />
                  {/* Selected state must not rely on border color alone
                      (§11 colour independence) — the check glyph is the
                      real signal. */}
                  {isSelected && (
                    <Check
                      className="size-4 text-interview-accent-text"
                      aria-hidden
                    />
                  )}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {label}
                </span>
                <span className="text-xs text-muted-foreground">{blurb}</span>
              </button>
            );
          })}
        </div>

        <ActionBubble
          state={selected ? "ready" : "disabled"}
          breathing={false}
          onClick={() => selected && onConfirm(selected)}
          className="w-full"
        >
          Sẵn sàng, bắt đầu
        </ActionBubble>
      </DialogContent>
    </Dialog>
  );
}
