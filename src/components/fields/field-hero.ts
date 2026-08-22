/**
 * Per-domain hero styling for `FieldView` — specs/003-ui-ux-blueprint.md §7c.
 *
 * Tailwind can't resolve a class built from a runtime string (`from-${x}-300`
 * is invisible to the JIT scanner), so each domain's gradient/orb classes are
 * spelled out here in full rather than interpolated from `DomainConfig.theme`.
 * Colors are picked to match each domain's existing `theme.text`/`badgeBg`
 * hue in `@/lib/domains`, just carried into a gradient-wash-plus-glow-orbs
 * hero instead of a flat tint.
 *
 * `mentor` is optional — only `tech` has an illustrated character today.
 * Add an entry here (image + name) when another domain gets one; `FieldView`
 * renders the mentor block only when it's present.
 */
export interface FieldHeroConfig {
  readonly backdrop: string;
  readonly orbLeft: string;
  readonly orbRight: string;
  readonly orbCenter: string;
  readonly mentor?: {
    readonly image: string;
    readonly name: string;
  };
}

const DEFAULT_HERO: FieldHeroConfig = {
  backdrop:
    "pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-violet-300 via-fuchsia-100 to-transparent dark:from-violet-900/60 dark:via-fuchsia-950/30",
  orbLeft: "absolute -left-40 -top-20 size-[28rem] rounded-full bg-interview-accent/40 blur-3xl",
  orbRight: "absolute -right-40 top-16 size-[28rem] rounded-full bg-fuchsia-500/35 blur-3xl",
  orbCenter:
    "absolute left-1/2 top-40 size-[24rem] -translate-x-1/2 rounded-full bg-violet-400/25 blur-3xl",
};

const FIELD_HERO_CONFIG: Record<string, FieldHeroConfig> = {
  tech: {
    backdrop:
      "pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-green-300 via-emerald-100 to-transparent dark:from-green-900/60 dark:via-emerald-950/30",
    orbLeft: "absolute -left-40 -top-20 size-[28rem] rounded-full bg-green-500/40 blur-3xl",
    orbRight: "absolute -right-40 top-16 size-[28rem] rounded-full bg-emerald-500/35 blur-3xl",
    orbCenter:
      "absolute left-1/2 top-40 size-[24rem] -translate-x-1/2 rounded-full bg-green-400/25 blur-3xl",
    mentor: { image: "/assets/dok.png", name: "Dok" },
  },
  marketing: {
    backdrop:
      "pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-rose-300 via-pink-100 to-transparent dark:from-rose-900/60 dark:via-pink-950/30",
    orbLeft: "absolute -left-40 -top-20 size-[28rem] rounded-full bg-rose-500/40 blur-3xl",
    orbRight: "absolute -right-40 top-16 size-[28rem] rounded-full bg-pink-500/35 blur-3xl",
    orbCenter:
      "absolute left-1/2 top-40 size-[24rem] -translate-x-1/2 rounded-full bg-rose-400/25 blur-3xl",
  },
  design: {
    backdrop:
      "pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-emerald-300 via-teal-100 to-transparent dark:from-emerald-900/60 dark:via-teal-950/30",
    orbLeft: "absolute -left-40 -top-20 size-[28rem] rounded-full bg-emerald-500/40 blur-3xl",
    orbRight: "absolute -right-40 top-16 size-[28rem] rounded-full bg-teal-500/35 blur-3xl",
    orbCenter:
      "absolute left-1/2 top-40 size-[24rem] -translate-x-1/2 rounded-full bg-emerald-400/25 blur-3xl",
  },
  data: {
    backdrop:
      "pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-sky-300 via-cyan-100 to-transparent dark:from-sky-900/60 dark:via-cyan-950/30",
    orbLeft: "absolute -left-40 -top-20 size-[28rem] rounded-full bg-sky-500/40 blur-3xl",
    orbRight: "absolute -right-40 top-16 size-[28rem] rounded-full bg-cyan-500/35 blur-3xl",
    orbCenter:
      "absolute left-1/2 top-40 size-[24rem] -translate-x-1/2 rounded-full bg-sky-400/25 blur-3xl",
  },
  product: {
    backdrop:
      "pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-amber-300 via-yellow-100 to-transparent dark:from-amber-900/60 dark:via-yellow-950/30",
    orbLeft: "absolute -left-40 -top-20 size-[28rem] rounded-full bg-amber-500/40 blur-3xl",
    orbRight: "absolute -right-40 top-16 size-[28rem] rounded-full bg-yellow-500/35 blur-3xl",
    orbCenter:
      "absolute left-1/2 top-40 size-[24rem] -translate-x-1/2 rounded-full bg-amber-400/25 blur-3xl",
  },
};

export function fieldHeroFor(domainId: string): FieldHeroConfig {
  return FIELD_HERO_CONFIG[domainId] ?? DEFAULT_HERO;
}
