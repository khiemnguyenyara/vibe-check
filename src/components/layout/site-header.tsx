"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";

import { GetStartedDialog } from "@/components/layout/get-started-dialog";
import { JobsMenu, MobileNavMenu } from "@/components/layout/nav-menu";
import type { DomainConfig } from "@/lib/domains";
import { useLocale } from "@/lib/i18n/locale-context";
import type { Locale } from "@/lib/i18n/types";

// Static — same mask on every render, so it's hoisted out instead of a
// fresh object literal each time SiteHeader renders.
const LOGO_MASK_STYLE: CSSProperties = {
  aspectRatio: "1130 / 272",
  maskImage: "url(/vibe-check-logo.png)",
  maskRepeat: "no-repeat",
  maskSize: "contain",
  maskPosition: "left center",
  WebkitMaskImage: "url(/vibe-check-logo.png)",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskSize: "contain",
  WebkitMaskPosition: "left center",
} as CSSProperties;

/** Two-letter toggle rather than a dropdown — there are only ever two locales. */
function LocaleToggle() {
  const { locale, setLocale, t } = useLocale();
  const other: Locale = locale === "vi" ? "en" : "vi";

  return (
    <button
      type="button"
      onClick={() => setLocale(other)}
      aria-label={t.header.localeToggleLabel}
      className="shrink-0 rounded-full border border-quest-surface-border px-2.5 py-1 text-xs font-bold uppercase text-foreground transition-colors hover:border-interview-accent/40 hover:text-interview-accent-text"
    >
      {other}
    </button>
  );
}

/**
 * Floating glass pill header — logo (→ home), a desktop nav (Home / Jobs
 * dropdown / About) collapsed into one menu on mobile, the locale toggle,
 * and Get Started opening the quick-intake popup. One shared component, so
 * every page that renders it stays in sync automatically.
 *
 * `domainConfig` scopes Get Started to one field — passed by `FieldView`
 * (specs/003 §7c) so a visitor already on e.g. `/fields/tech` picks a
 * specialty within that field instead of re-picking the field from
 * scratch, and the popup picks up that field's accent color. Static from
 * `@/lib/domains` for now; the intent is this becomes backend-driven
 * per specialty later without changing this prop's shape.
 */
export function SiteHeader({
  domainConfig,
}: {
  readonly domainConfig?: DomainConfig;
} = {}) {
  const { t } = useLocale();
  const [getStartedOpen, setGetStartedOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 py-3 sm:px-4 bg-quest-surface/80 backdrop-blur-xl supports-[backdrop-filter]:bg-quest-surface/60">
      <div className="mx-auto flex max-w-7xl items-center gap-1">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-full py-1 pr-2 opacity-100 transition-opacity hover:opacity-80"
        >
          {/* Masked rather than an <img> — vibe-check-logo.png ships its own
              purple gradient, but going through a mask + background-color
              instead discards that in favor of --interview-accent, so the
              mark still recolors with the field like everything else here. */}
          <span
            role="img"
            aria-label={t.header.brand}
            className="inline-block h-7 w-auto shrink-0 bg-interview-accent transition-colors sm:h-8"
            style={LOGO_MASK_STYLE}
          />
        </Link>

        <nav
          aria-label={t.header.fieldsNavLabel}
          className="ml-1 hidden items-center gap-0.5 md:flex"
        >
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/5"
          >
            {t.header.homeNav}
          </Link>
          <JobsMenu />
          <Link
            href="/about"
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/5"
          >
            {t.header.aboutNav}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LocaleToggle />
          <button
            type="button"
            onClick={() => setGetStartedOpen(true)}
            className="shrink-0 rounded-full bg-interview-accent px-4 py-1.5 text-sm font-bold text-interview-accent-foreground transition-[box-shadow,opacity] hover:opacity-90 hover:shadow-[0_8px_20px_-8px_var(--quest-glow)]"
          >
            {t.header.getStartedCta}
          </button>
          <div className="md:hidden">
            <MobileNavMenu />
          </div>
        </div>
      </div>

      <GetStartedDialog
        open={getStartedOpen}
        onOpenChange={setGetStartedOpen}
        domainConfig={domainConfig}
      />
    </header>
  );
}
