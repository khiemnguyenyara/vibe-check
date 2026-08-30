import type { CSSProperties } from "react";

/**
 * Field accent overrides, applied on a section root (specs/003 §3.1).
 *
 * Also apply this directly on any Base UI `Menu.Positioner`/`SubmenuTrigger`/
 * `DialogContent` that portals — those render into `document.body`, outside
 * whatever DOM subtree a page-level `fieldAccent()` scopes, so plain CSS
 * inheritance never reaches them and they'd fall back to the default accent.
 */
export function fieldAccent(domainId: string): CSSProperties {
  return {
    "--interview-accent": `var(--station-accent-${domainId}, var(--interview-accent))`,
    "--interview-accent-text": `var(--station-accent-${domainId}-text, var(--station-accent-${domainId}, var(--interview-accent-text)))`,
    // globals.css only derives --quest-glow from --interview-accent at
    // :root, so every hover glow (GlassCard, header CTA, chat bubbles, the
    // mascot, ...) stayed the default violet on a field page unless it's
    // re-derived here too, off this element's own --interview-accent.
    "--quest-glow": "color-mix(in oklch, var(--interview-accent) 45%, transparent)",
  } as CSSProperties;
}
