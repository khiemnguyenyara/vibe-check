"use client";

import type { FormEvent } from "react";
import { Search, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { useLocale } from "@/lib/i18n/locale-context";
import { MAP_ENTRY, riseVariants } from "@/lib/motion/tokens";

/**
 * Hero — badge, headline, and a live search over every specialty. Replaces
 * the previous auto-advancing slider: the reference layout leads with a
 * single static headline and puts the search bar to work instead of copy
 * that rotates every few seconds.
 */
export function HeroSearch({
  query,
  onQueryChange,
}: {
  readonly query: string;
  readonly onQueryChange: (value: string) => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const { t } = useLocale();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    document
      .getElementById("coaches")
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  return (
    // -mt-16 pulls the section up under the sticky header (~64px tall)
    // instead of starting after it, so the header floats over the hero's
    // gradient rather than sitting in a gap above it. The content wrapper's
    // extra top padding (pt-28/pt-32 = original py-12/py-16 + that same
    // 64px) keeps the actual copy clear of the header — only the
    // background bleeds underneath.
    <section className="relative isolate -mt-16 overflow-hidden border-b border-quest-surface-border">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-transparent"
      />

      <div className="mx-auto max-w-5xl px-4 pt-28 pb-12 text-center sm:px-6 sm:pt-32 sm:pb-16">
        <motion.span
          variants={riseVariants(reduced)}
          initial="hidden"
          animate="visible"
          custom={MAP_ENTRY.header}
          className="inline-flex items-center gap-1.5 rounded-full border border-interview-accent/25 bg-quest-surface px-3 py-1 text-xs font-bold text-interview-accent-text"
        >
          <Sparkles className="size-3.5" aria-hidden />
          {t.home.hero.badge}
        </motion.span>

        <motion.h1
          variants={riseVariants(reduced)}
          initial="hidden"
          animate="visible"
          custom={MAP_ENTRY.header + 0.05}
          className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl"
        >
          {t.home.hero.titleLead}{" "}
          <span className="text-interview-accent-text">
            {t.home.hero.titleAccent}
          </span>
        </motion.h1>

        <motion.p
          variants={riseVariants(reduced)}
          initial="hidden"
          animate="visible"
          custom={MAP_ENTRY.header + 0.1}
          className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base"
        >
          {t.home.hero.body}
        </motion.p>

        <motion.form
          variants={riseVariants(reduced)}
          initial="hidden"
          animate="visible"
          custom={MAP_ENTRY.header + 0.15}
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-full border border-quest-surface-border bg-quest-surface p-1.5 shadow-sm"
        >
          <Search
            className="ml-2 size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <input
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={t.home.hero.searchPlaceholder}
            aria-label={t.home.hero.searchAria}
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-interview-accent px-4 py-2 text-sm font-bold text-interview-accent-foreground transition-shadow hover:shadow-[0_8px_20px_-8px_var(--quest-glow)]"
          >
            {t.home.hero.searchCta}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
