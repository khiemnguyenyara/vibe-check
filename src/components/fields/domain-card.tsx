"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { fieldAccent } from "@/components/home/field-accent";
import { GlassCard } from "@/components/ui/glass-card";
import type { DomainConfig } from "@/lib/domains";
import { domainCopy } from "@/lib/i18n/domain-copy";
import { useLocale } from "@/lib/i18n/locale-context";
import { riseVariants } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

/** One domain tile in the /fields grid — links into that group's specialties. */
export function DomainCard({
  domain,
  delay = 0,
}: {
  readonly domain: DomainConfig;
  readonly delay?: number;
}) {
  const reduced = useReducedMotion() ?? false;
  const { t } = useLocale();
  const copy = domainCopy(t, domain);
  const Icon = domain.icon;

  return (
    <motion.div
      variants={riseVariants(reduced)}
      initial="hidden"
      animate="visible"
      custom={delay}
      style={fieldAccent(domain.id)}
    >
      <Link href={`/fields/${domain.id}`} className="block h-full">
        <GlassCard variant="interactive" className="flex h-full flex-col gap-3 p-5">
          <span
            className={cn(
              "grid size-12 place-items-center rounded-2xl text-white",
              domain.theme.badgeBg
            )}
          >
            <Icon className="size-6" aria-hidden />
          </span>

          <div>
            <h3 className="text-lg font-extrabold text-interview-accent-text">
              {copy.sectionTitle}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {copy.description}
            </p>
          </div>

          <div className="mt-auto flex flex-wrap gap-1.5">
            {domain.specialties.map((specialty) => (
              <span
                key={specialty.id}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  domain.theme.pillBg,
                  domain.theme.pillText
                )}
              >
                {specialty.label}
              </span>
            ))}
          </div>

          {domain.comingSoon && (
            <span className="inline-flex self-start rounded-full bg-quest-locked px-2 py-0.5 text-[10px] font-bold text-quest-locked-foreground">
              {t.home.field.comingSoon}
            </span>
          )}

          <span className="inline-flex items-center gap-1 text-sm font-bold text-interview-accent-text">
            {t.fields.viewSpecialties}
            <ChevronRight className="size-4" aria-hidden />
          </span>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
