"use client";

import { motion, useReducedMotion } from "framer-motion";

import { LauncherCard } from "@/components/home/launcher-card";
import { LauncherCardList } from "@/components/home/launcher-card-list";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { useLocale } from "@/lib/i18n/locale-context";
import { riseVariants } from "@/lib/motion/tokens";

import { homeStyles } from "./page.styles";

/**
 * The practice home — a minimal launcher with exactly two choices: start an
 * interview now, or (soon) get CV feedback. Field/specialty picking happens
 * one step later, on /fields.
 */
export default function Home() {
  const reduced = useReducedMotion() ?? false;
  const { t } = useLocale();

  return (
    <div className={homeStyles.root}>
      {/* Hero backdrop — decorative only, scoped behind the launcher rather
          than fixed to the viewport, so it scrolls away with the content. */}
      <div aria-hidden className={homeStyles.heroBackdrop}>
        <div className={homeStyles.heroOrbLeft} />
        <div className={homeStyles.heroOrbRight} />
        <div className={homeStyles.heroOrbCenter} />
      </div>

      <SiteHeader />

      <main className={homeStyles.main}>
        <motion.div
          variants={riseVariants(reduced)}
          initial="hidden"
          animate="visible"
          custom={0}
          className={homeStyles.heading}
        >
          <h1 className={homeStyles.title}>{t.home.title}</h1>
          <p className={homeStyles.subtitle}>{t.home.subtitle}</p>
        </motion.div>

        <LauncherCardList>
          <LauncherCard
            href="/fields"
            title={t.home.startInterview.title}
            body={t.home.startInterview.body}
            delay={0}
            reduced={reduced}
          />
          <LauncherCard
            title={t.home.improveCv.title}
            body={t.home.improveCv.body}
            badge={t.home.improveCv.badge}
            delay={0.08}
            reduced={reduced}
          />
        </LauncherCardList>
      </main>

      <SiteFooter />
    </div>
  );
}
