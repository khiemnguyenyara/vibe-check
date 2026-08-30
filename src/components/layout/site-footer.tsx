"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";

import { fieldHeroFor } from "@/components/fields/field-hero";
import { useLocale } from "@/lib/i18n/locale-context";

import { siteFooterStyles } from "./site-footer.styles";

/**
 * Remote (Unsplash) rather than bundled — the host is already allowed in
 * next.config.ts `images.remotePatterns`.
 */
const FOOTER_IMAGE =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=60";

export function SiteFooter({
  domainId,
}: {
  /** Looks up this domain's `footerMark` (field-hero.ts) — every domain
   *  points at the same constant asset for now, but reading it through the
   *  config instead of hardcoding a path here means a future per-domain
   *  mark only needs an edit there. Omit on pages with no domain (home,
   *  about, /fields) to get the same constant via the default entry. */
  readonly domainId?: string;
}) {
  const { t } = useLocale();
  const footerMark = fieldHeroFor(domainId).footerMark;

  return (
    <footer className={siteFooterStyles.footer}>
      {/* Remote photo, held well back with low opacity so the footer text
          keeps its contrast. Decorative only — empty alt. */}
      <Image
        src={FOOTER_IMAGE}
        alt=""
        fill
        sizes="100vw"
        aria-hidden
        className={siteFooterStyles.backgroundImage}
      />
      <div aria-hidden className={siteFooterStyles.overlay} />

      <div className={siteFooterStyles.content}>
        <Image
          src={footerMark}
          alt={t.header.brand}
          width={40}
          height={40}
          className={siteFooterStyles.logo}
        />
        <span className={siteFooterStyles.tagline}>
          <Sparkles className={siteFooterStyles.taglineIcon} aria-hidden />
          {t.footer.tagline}
        </span>
        <p className={siteFooterStyles.description}>{t.footer.description}</p>
        <p className={siteFooterStyles.copyright}>{t.footer.copyright}</p>
      </div>
    </footer>
  );
}
