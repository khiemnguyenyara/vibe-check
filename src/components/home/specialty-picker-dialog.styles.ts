import { cva } from "class-variance-authority";

export const specialtyPickerDialogStyles = {
  title: "text-base font-extrabold text-foreground",
  subtitle: "-mt-2 text-xs text-muted-foreground",
  grid: "mt-1 grid gap-2.5 sm:grid-cols-2",
  optionIcon: "size-5 text-interview-accent-text",
  optionLabel: "text-sm font-bold text-foreground",
  optionBadge:
    "inline-flex w-fit rounded-full bg-quest-locked px-2 py-0.5 text-[10px] font-bold text-quest-locked-foreground",
} as const;

export const specialtyOptionVariants = cva(
  [
    "group relative flex flex-col items-start gap-2 rounded-2xl border p-3 text-left",
    "outline-none transition-[box-shadow,transform,border-color]",
    "focus-visible:ring-2 focus-visible:ring-interview-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      disabled: {
        true: "cursor-not-allowed border-quest-surface-border bg-quest-surface opacity-60",
        false:
          "border-quest-surface-border bg-quest-surface hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-10px_var(--quest-glow)] motion-reduce:hover:translate-y-0",
      },
    },
    defaultVariants: { disabled: false },
  }
);
