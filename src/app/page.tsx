"use client";

import { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { LauncherCard } from "@/components/home/launcher-card";
import { LauncherCardList } from "@/components/home/launcher-card-list";
import { SpecialtyPickerDialog } from "@/components/home/specialty-picker-dialog";
import { SpecialtySelectorSection } from "@/components/home/specialty-selector-section";
import { MentorCharacterSection } from "@/components/home/mentor-character-section";
import { SiteHeader } from "@/components/layout/site-header";
import { useLocale } from "@/lib/i18n/locale-context";
import { riseVariants } from "@/lib/motion/tokens";

import { homeStyles } from "./page.styles";

export default function Home() {
  const reduced = useReducedMotion() ?? false;
  const { t } = useLocale();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const mentorSlideRef = useRef<HTMLDivElement>(null);

  // Scroll to mentor section when specialty selected
  const handleSelectSpecialty = (domainId: string) => {
    setSelectedDomain(domainId);
    // Scroll to mentor section on next render
    requestAnimationFrame(() => {
      mentorSlideRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <div className="scroll-smooth snap-y snap-mandatory h-screen overflow-y-scroll">
      {/* Slide 1: Hero/Launcher */}
      <div className="snap-center h-screen flex flex-col relative overflow-hidden">
        {/* Hero backdrop */}
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
          </motion.div>

          <LauncherCardList>
            <LauncherCard
              onClick={() => setPickerOpen(true)}
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
          </motion.div>
        </main>
      </div>

      {/* Slide 2: Specialty Selector */}
      <div className="snap-center h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="w-full"
        >
          <SpecialtySelectorSection
            onSelectSpecialty={handleSelectSpecialty}
            reduced={reduced}
          />
        </motion.div>
      </div>

      {/* Slide 3: Mentor Character - only visible when specialty is selected */}
      {selectedDomain && (
        <div
          ref={mentorSlideRef}
          className="snap-center h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/95"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            className="w-full"
          >
            <MentorCharacterSection selectedDomain={selectedDomain} reduced={reduced} />
          </motion.div>
        </div>
      )}

      <SpecialtyPickerDialog open={pickerOpen} onOpenChange={setPickerOpen} />
    </div>
  );
}
