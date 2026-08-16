"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { GlassCard } from "@/components/ui/glass-card";
import { useLocale } from "@/lib/i18n/locale-context";
import { riseVariants } from "@/lib/motion/tokens";

const BOOKING_IMAGE =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=60";

function StatCard({
  value,
  label,
  caption,
}: {
  readonly value: string;
  readonly label: string;
  readonly caption: string;
}) {
  return (
    <GlassCard variant="quiet" className="flex flex-col">
      <p className="text-3xl font-extrabold tabular-nums text-interview-accent-text">
        {value}
      </p>
      <p className="mt-1 text-sm font-bold text-foreground">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {caption}
      </p>
    </GlassCard>
  );
}

/**
 * Bento row below the hero: two stat cards and a bold banner on the left,
 * a tall booking-style image card on the right. Mirrors the reference
 * layout's proportions while reusing only tokens already in the palette
 * (`--interview-accent`, `GlassCard`) — no new colors introduced.
 */
export function StatsBooking({
  specialtyCount,
  domainCount,
  onExplore,
  onBookingCta,
}: {
  readonly specialtyCount: number;
  readonly domainCount: number;
  readonly onExplore: () => void;
  readonly onBookingCta: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const { t } = useLocale();

  return (
    <motion.div
      variants={riseVariants(reduced)}
      initial="hidden"
      animate="visible"
      custom={0.05}
      className="grid gap-4 lg:grid-cols-2"
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            value={`${specialtyCount}+`}
            label={t.home.stats.specialtiesLabel}
            caption={t.home.stats.specialtiesCaption}
          />
          <StatCard
            value={`${domainCount}+`}
            label={t.home.stats.domainsLabel}
            caption={t.home.stats.domainsCaption}
          />
        </div>

        <button
          type="button"
          onClick={onExplore}
          className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl bg-interview-accent p-5 text-left text-interview-accent-foreground shadow-[0_10px_30px_-10px_var(--quest-glow)] transition-transform hover:-translate-y-0.5"
        >
          <p className="text-lg font-extrabold uppercase leading-tight tracking-tight sm:text-xl">
            {t.home.stats.bannerLine1}
            <br />
            {t.home.stats.bannerLine2}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold">
            {t.home.stats.bannerCta}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </span>
        </button>
      </div>

      <div className="relative min-h-64 overflow-hidden rounded-2xl border border-quest-surface-border lg:min-h-full">
        <Image
          src={BOOKING_IMAGE}
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          aria-hidden
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="text-xl font-extrabold text-white">
            {t.home.stats.bookingTitle}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-white/80">
            {t.home.stats.bookingBody}
          </p>
          <button
            type="button"
            onClick={onBookingCta}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition-transform hover:-translate-y-0.5"
          >
            {t.home.stats.bookingCta}
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
