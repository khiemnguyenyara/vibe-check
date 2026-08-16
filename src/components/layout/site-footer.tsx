"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";

import { useLocale } from "@/lib/i18n/locale-context";

/**
 * Remote (Unsplash) rather than bundled — the host is already allowed in
 * next.config.ts `images.remotePatterns`.
 */
const FOOTER_IMAGE =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=60";

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="relative isolate overflow-hidden border-t border-quest-surface-border">
      {/* Remote photo, held well back with low opacity so the footer text
          keeps its contrast. Decorative only — empty alt. */}
      <Image
        src={FOOTER_IMAGE}
        alt=""
        fill
        sizes="100vw"
        aria-hidden
        className="-z-10 object-cover opacity-50"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 to-background/90"
      />

      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-3 py-20 text-center sm:px-4 sm:py-24">
        <Image
          src="/vibe-check-mark.png"
          alt={t.header.brand}
          width={40}
          height={40}
          className="size-10 rounded-xl object-cover"
        />
        <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Sparkles className="size-4" aria-hidden />
          {t.footer.tagline}
        </span>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          {t.footer.description}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
