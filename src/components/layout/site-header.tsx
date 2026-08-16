"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { GetStartedDialog } from "@/components/layout/get-started-dialog";
import { JobsMenu, MobileNavMenu } from "@/components/layout/nav-menu";
import { useLocale } from "@/lib/i18n/locale-context";
import type { Locale } from "@/lib/i18n/types";

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
 */
export function SiteHeader() {
  const { t } = useLocale();
  const [getStartedOpen, setGetStartedOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div className="mx-auto flex max-w-7xl items-center gap-1 rounded-full border border-quest-surface-border bg-quest-surface/80 py-1.5 pl-2 pr-1.5 shadow-[0_8px_30px_-14px_rgba(0,0,0,0.25)] backdrop-blur-xl supports-[backdrop-filter]:bg-quest-surface/60 sm:pl-3 sm:pr-2">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-full py-1 pr-2 opacity-100 transition-opacity hover:opacity-80"
        >
          <Image
            src="/vibe-check-logo.png"
            alt={t.header.brand}
            width={1130}
            height={272}
            className="h-7 w-auto shrink-0 object-contain sm:h-8"
            priority
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

      <GetStartedDialog open={getStartedOpen} onOpenChange={setGetStartedOpen} />
    </header>
  );
}
