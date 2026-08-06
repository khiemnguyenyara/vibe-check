"use client";

import Image from "next/image";

import { domains } from "@/lib/domains";
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
      className="ml-auto shrink-0 rounded-full border border-quest-surface-border bg-quest-surface px-2.5 py-1 text-xs font-bold uppercase text-foreground transition-colors hover:border-interview-accent/40 hover:text-interview-accent-text"
    >
      {other}
    </button>
  );
}

/**
 * Blurred sticky header: brand row, then the career categories as a single
 * scrollable rail so the fields are reachable before any scrolling.
 */
export function SiteHeader({
  onPickField,
}: {
  readonly onPickField: (domainId: string) => void;
}) {
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-quest-surface-border bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto max-w-5xl px-3 sm:px-4">
        <div className="flex items-center gap-2.5 py-2.5">
          <Image
            src="/vibe_check.jpg"
            alt={t.header.brand}
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-xl object-cover"
            priority
          />
          <span className="text-base font-extrabold tracking-tight text-foreground">
            {t.header.brand}
          </span>
          <LocaleToggle />
        </div>

        <nav
          aria-label={t.header.fieldsNavLabel}
          className="-mx-3 flex gap-1.5 overflow-x-auto px-3 pb-2 sm:-mx-4 sm:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {domains.map((domain) => {
            const Icon = domain.icon;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => onPickField(domain.id)}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-quest-surface-border bg-quest-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-interview-accent/40 hover:text-interview-accent-text"
              >
                <Icon className="size-3.5" aria-hidden />
                {domain.sectionTitle}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
