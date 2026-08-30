"use client";

import { motion, useReducedMotion } from "framer-motion";

import { fieldAccent } from "@/components/home/field-accent";
import type { ResolvedNode } from "@/components/home/types";
import type { useFieldNavigation } from "@/components/home/use-field-navigation";
import { LevelPickerDialog } from "@/components/interview/level-picker-dialog";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { DomainConfig } from "@/lib/domains";
import { domainCopy } from "@/lib/i18n/domain-copy";
import { useLocale } from "@/lib/i18n/locale-context";
import { riseVariants } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

import { fieldHeroFor } from "./field-hero";
import { FieldMentor } from "./field-mentor";
import { SpecialtyCarousel } from "./specialty-carousel";
import { fieldViewStyles as styles } from "./field-view.styles";

/**
 * The shared field page — header, a per-domain hero (gradient wash + glow
 * orbs, `field-hero.ts`), an optional illustrated mentor, an auto-scrolling
 * carousel of that domain's specialties, and the footer. Specs/003
 * §7c/§10.1c. Every `/fields/[domain]` route renders through this — there is
 * no separate plain-grid fallback any more; a domain with no bespoke hero
 * color or mentor configured in `field-hero.ts` just gets the default
 * (violet) wash and no mentor block.
 */
export function FieldView({
  domainConfig,
  nodes,
  navigation,
}: {
  readonly domainConfig: DomainConfig;
  readonly nodes: readonly ResolvedNode[];
  readonly navigation: ReturnType<typeof useFieldNavigation>;
}) {
  const reduced = useReducedMotion() ?? false;
  const { t } = useLocale();
  const {
    lockNotice,
    handleEnter,
    pendingNode,
    handleConfirmLevel,
    closeLevelPicker,
  } = navigation;

  const hero = fieldHeroFor(domainConfig.id);
  const copy = domainCopy(t, domainConfig);

  return (
    <div className={styles.root} style={fieldAccent(domainConfig.id)}>
      <div className={styles.heroWrap}>
        <div aria-hidden className={hero.backdrop}>
          <div className={hero.orbLeft} />
          <div className={hero.orbRight} />
          <div className={hero.orbCenter} />
        </div>

        <SiteHeader domainConfig={domainConfig} />

        <main className={styles.main}>
          <motion.div
            variants={riseVariants(reduced)}
            initial="hidden"
            animate="visible"
            custom={0}
            className={styles.heading}
          >
            <h1 className={styles.title}>{copy.sectionTitle}</h1>
            <p className={styles.subtitle}>{copy.description}</p>
          </motion.div>

          {hero.mentor && (
            <FieldMentor image={hero.mentor.image} name={hero.mentor.name} />
          )}

          <div className={styles.carouselSection}>
            <SpecialtyCarousel nodes={nodes} onActivate={handleEnter} />
          </div>
        </main>
      </div>

      {/* Empty by default (no locked-node tap yet), and must stay mounted so
          `aria-live` picks up the first announcement — but an empty flex
          item's own margin never collapses away, so the spacing is
          conditional on there actually being a message (specs/003 §15.13). */}
      <p
        aria-live="polite"
        className={cn(styles.lockNotice, lockNotice && styles.lockNoticeSpacing)}
      >
        {lockNotice}
      </p>

      <SiteFooter domainId={domainConfig.id} />

      <LevelPickerDialog
        open={pendingNode !== null}
        domainId={domainConfig.id}
        specialtyLabel={pendingNode?.specialty.title ?? ""}
        onOpenChange={(open) => {
          if (!open) closeLevelPicker();
        }}
        onConfirm={handleConfirmLevel}
      />
    </div>
  );
}
