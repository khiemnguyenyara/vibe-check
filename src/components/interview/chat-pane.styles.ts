import { cva } from "class-variance-authority";

export const chatPaneStyles = {
  root: "relative flex h-full min-h-0 flex-col overflow-hidden bg-neutral-100 dark:bg-neutral-950",

  header:
    "sticky top-0 z-20 flex shrink-0 items-center gap-3 border-b border-quest-surface-border bg-background/95 px-4 py-2.5 backdrop-blur-sm sm:px-8",
  heartsRow: "flex items-center gap-1",
  heartSpacer: "flex-1",
  headerMascot: "!h-14 !w-14 shrink-0",

  scrollArea: "relative z-10 flex-1 overflow-y-auto px-4 py-6 sm:px-8",
  transcript: "mx-auto flex w-full max-w-2xl flex-col gap-4",
  turn: "flex flex-col gap-4",
  questionRow: "flex items-start gap-2",

  avatar:
    "relative size-9 shrink-0 overflow-hidden rounded-full border-2 border-quest-surface-border bg-quest-surface shadow-[0_4px_12px_-6px_var(--quest-glow)]",
  avatarImage: "object-cover",

  aiBubble:
    "relative max-w-[85%] self-start rounded-3xl rounded-tl-md border-2 border-quest-surface-border bg-quest-surface px-4 py-3 text-sm leading-relaxed text-card-foreground shadow-[0_10px_28px_-14px_var(--quest-glow)]",

  userBubble:
    "max-w-[85%] self-end whitespace-pre-wrap rounded-3xl rounded-br-md bg-interview-accent px-4 py-3 text-sm leading-relaxed text-interview-accent-foreground shadow-[0_10px_28px_-14px_var(--quest-glow)]",

  optionsList: "flex max-w-[85%] flex-col gap-2 self-start",
  optionLabel: "text-card-foreground",
  optionCheckBadge:
    "flex size-5 shrink-0 items-center justify-center rounded-full bg-interview-accent text-interview-accent-foreground",

  pendingAiBubble:
    "flex max-w-[85%] flex-col gap-2 self-start rounded-3xl rounded-tl-md border-2 border-quest-surface-border bg-quest-surface px-4 py-3 shadow-[0_10px_28px_-14px_var(--quest-glow)]",
  pendingEvaluation:
    "flex max-w-[85%] flex-col gap-2 self-start rounded-3xl border-2 border-dashed border-foreground/30 px-4 py-3",

  errorBubble:
    "flex max-w-[85%] flex-col items-start gap-2 self-start rounded-3xl rounded-tl-md border-2 border-destructive bg-quest-surface px-4 py-3 text-sm text-destructive shadow-[0_10px_28px_-14px_var(--quest-glow)]",
  errorActions: "flex items-center gap-2",
  errorRetryButton:
    "h-7 gap-1.5 rounded-full border-2 border-destructive text-xs text-destructive",
  errorAbandonButton:
    "h-7 gap-1.5 rounded-full text-xs text-destructive/70 hover:text-destructive",

  readOnlyBadge:
    "self-center rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-muted-foreground",

  footer:
    "relative z-10 shrink-0 border-t border-quest-surface-border bg-background p-4 sm:px-8",
  footerInner: "mx-auto flex w-full max-w-2xl flex-col gap-3",
  controlsRow: "flex items-end gap-2",
  optionHint: "flex min-h-12 flex-1 items-center text-sm text-muted-foreground",
  textarea:
    "max-h-40 min-h-12 flex-1 resize-none rounded-sm border border-quest-surface-border bg-background px-3 py-2.5 shadow-none focus-visible:border-interview-accent focus-visible:ring-0",
  micButton:
    "size-11 shrink-0 rounded-full border border-quest-surface-border bg-background text-foreground/70",
  submitButton: "w-full font-extrabold tracking-wide",
} as const;

/**
 * Duolingo's option cards read as physical buttons — border-2 with a
 * chunky bottom edge that compresses on press, not a flat hover tint. The
 * selected state fills solid rather than just tinting the border so it
 * reads at a glance, matching how `UserBubble` already commits to a solid
 * fill instead of an outline.
 */
export const optionButtonVariants = cva(
  [
    "flex items-center justify-between gap-2 rounded-2xl border-2 border-b-4 p-3 text-left text-sm font-semibold",
    "outline-none transition-colors",
    "focus-visible:ring-2 focus-visible:ring-interview-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  ],
  {
    variants: {
      interactive: {
        true: "cursor-pointer",
        false: "cursor-default",
      },
      selected: {
        true: "border-interview-accent bg-interview-accent text-interview-accent-foreground shadow-[0_10px_30px_-14px_var(--quest-glow)]",
        false: "border-quest-surface-border bg-quest-surface text-card-foreground",
      },
    },
    defaultVariants: { interactive: true, selected: false },
  }
);

export const heartVariants = cva("text-lg leading-none transition-opacity", {
  variants: {
    lost: {
      true: "opacity-20 grayscale",
      false: "",
    },
  },
  defaultVariants: { lost: false },
});
