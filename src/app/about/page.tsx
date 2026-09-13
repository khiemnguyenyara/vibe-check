"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { useLocale } from "@/lib/i18n/locale-context";

export default function AboutPage() {
  const { t } = useLocale();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-3 py-16 sm:px-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          {t.footer.tagline}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t.footer.description}
        </p>
      </main>
    </div>
  );
}
