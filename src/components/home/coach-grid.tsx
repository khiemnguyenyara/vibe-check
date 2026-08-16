"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { useLocale } from "@/lib/i18n/locale-context";
import { STAGGER, riseVariants } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

import { CoachCard } from "./coach-card";
import type { ResolvedNode } from "./types";

/** Teaser cap for the default (no filter, no search) browse view. */
const DEFAULT_LIMIT = 9;

function matchesQuery(node: ResolvedNode, query: string): boolean {
  if (!query) return true;
  const haystack =
    `${node.specialty.title} ${node.specialty.description} ${node.domain.sectionTitle}`.toLowerCase();
  return haystack.includes(query);
}

/**
 * The "Mentors"-style section: domain filter tabs above a card grid of every
 * specialty, each rendered as a coach profile. Flattened across domains
 * (rather than the old one-section-per-field stack) so it reads as one
 * grid, matching the reference layout.
 */
export function CoachGrid({
  byField,
  searchQuery,
  onEnter,
}: {
  readonly byField: readonly { domain: ResolvedNode["domain"]; nodes: readonly ResolvedNode[] }[];
  readonly searchQuery: string;
  readonly onEnter: (node: ResolvedNode) => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const { t } = useLocale();
  const [selectedDomain, setSelectedDomain] = useState<string>("all");

  const query = searchQuery.trim().toLowerCase();
  const isFiltering = selectedDomain !== "all" || query.length > 0;

  const allNodes = useMemo(
    () => byField.flatMap((field) => field.nodes),
    [byField]
  );

  const filtered = useMemo(
    () =>
      allNodes.filter(
        (node) =>
          (selectedDomain === "all" || node.domain.id === selectedDomain) &&
          matchesQuery(node, query)
      ),
    [allNodes, selectedDomain, query]
  );

  const visible = isFiltering ? filtered : filtered.slice(0, DEFAULT_LIMIT);
  const hasMore = !isFiltering && filtered.length > DEFAULT_LIMIT;

  return (
    <section id="coaches" className="scroll-mt-20">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedDomain("all")}
          className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors",
            selectedDomain === "all"
              ? "border-interview-accent bg-interview-accent text-interview-accent-foreground"
              : "border-quest-surface-border bg-quest-surface text-foreground hover:border-interview-accent/40"
          )}
        >
          {t.home.coaches.filterAll}
        </button>
        {byField.map(({ domain }) => (
          <button
            key={domain.id}
            type="button"
            onClick={() => setSelectedDomain(domain.id)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors",
              selectedDomain === domain.id
                ? "border-interview-accent bg-interview-accent text-interview-accent-foreground"
                : "border-quest-surface-border bg-quest-surface text-foreground hover:border-interview-accent/40"
            )}
          >
            {domain.sectionTitle}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((node, index) => (
            <motion.li
              key={`${node.domain.id}-${node.specialty.id}`}
              variants={riseVariants(reduced)}
              initial="hidden"
              animate="visible"
              custom={index * STAGGER.stations}
            >
              <CoachCard node={node} onActivate={() => onEnter(node)} />
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t.home.coaches.empty}
        </p>
      )}

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Link
            href="/fields"
            className="inline-flex items-center gap-1.5 rounded-full border border-interview-accent/35 bg-quest-surface px-4 py-2 text-sm font-bold text-interview-accent-text transition-colors hover:bg-interview-accent/10"
          >
            {t.home.coaches.showMore}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      )}
    </section>
  );
}
