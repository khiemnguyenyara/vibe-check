import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * GlassCard — specs/003-ui-ux-blueprint.md §4.
 *
 * ## Why `quiet` and `interactive` carry no backdrop-filter
 *
 * §4.2 lists "light blur" for both, but §12.3 caps simultaneous
 * backdrop-blur surfaces at 3 and §4.4 forbids blur on anything that scrolls
 * with content moving behind it. The Quest Map shows 3–5 stations at once
 * inside a scrolling column: honouring the variant table literally would
 * breach the performance budget on the map's very first screen.
 *
 * Real backdrop-filter is therefore reserved for `active` and `overlay` —
 * few, and rarely scrolling. `quiet`/`interactive` get a translucent tint
 * over the page gradient, which is visually near-identical and free.
 * Recorded as an as-built deviation in the spec.
 */
const glassCardVariants = cva(
  [
    "relative rounded-2xl border",
    "border-quest-surface-border bg-quest-surface",
    // Never clip a focus ring (§4.1) — overflow-hidden here would swallow the
    // ring on any focusable child.
    "transition-[box-shadow,transform,background-color]",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      variant: {
        quiet: "shadow-sm",
        interactive: [
          "shadow-sm cursor-pointer",
          // Lift only, never scale: scaling a translucent surface resamples
          // what is behind it and shimmers (§4.3).
          "hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_var(--quest-glow)]",
          "active:translate-y-0 active:shadow-sm",
          "motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0",
        ],
        active: [
          "supports-[backdrop-filter]:backdrop-blur-md",
          "border-interview-accent/45",
          "shadow-[0_10px_30px_-10px_var(--quest-glow)]",
        ],
        overlay: [
          "supports-[backdrop-filter]:backdrop-blur-xl",
          "shadow-[0_20px_60px_-20px_oklch(0_0_0/0.45)]",
        ],
      },
      padded: {
        true: "p-4 sm:p-5",
        false: "",
      },
    },
    defaultVariants: { variant: "quiet", padded: true },
  }
);

export interface GlassCardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof glassCardVariants> {
  /** Render as a different element (e.g. "section", "li") without a wrapper. */
  as?: React.ElementType;
}

export function GlassCard({
  className,
  variant,
  padded,
  as: Component = "div",
  ...props
}: GlassCardProps) {
  return (
    <Component
      data-slot="glass-card"
      data-variant={variant ?? "quiet"}
      className={cn(glassCardVariants({ variant, padded }), className)}
      {...props}
    />
  );
}

export { glassCardVariants };
