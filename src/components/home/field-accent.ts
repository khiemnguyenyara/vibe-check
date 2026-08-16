import type { CSSProperties } from "react";

/** Field accent overrides, applied on a section root (specs/003 §3.1). */
export function fieldAccent(domainId: string): CSSProperties {
  return {
    "--interview-accent": `var(--station-accent-${domainId}, var(--interview-accent))`,
    "--interview-accent-text": `var(--station-accent-${domainId}-text, var(--station-accent-${domainId}, var(--interview-accent-text)))`,
  } as CSSProperties;
}
