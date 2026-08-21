import { cva } from "class-variance-authority";

export const launcherCardVariants = cva(
  "flex h-full min-h-[280px] flex-col items-start justify-center gap-4 p-8",
  {
    variants: {
      disabled: {
        true: "cursor-not-allowed opacity-70",
        false: "",
      },
    },
    defaultVariants: { disabled: false },
  }
);

export const launcherCardStyles = {
  link: "block h-full",
  title: "font-heading text-2xl font-extrabold text-foreground",
  body: "mt-2 text-base text-muted-foreground",
  badge: "inline-flex rounded-full bg-quest-locked px-2.5 py-1 text-xs font-bold text-quest-locked-foreground",
} as const;
