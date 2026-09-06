"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { domains } from "@/lib/domains";
import { DURATION, riseVariants } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale-context";
import { formatMessage } from "@/lib/i18n/format";
import { mentorCharacterStyles as styles } from "./mentor-character-section.styles";
import { CharacterMascot } from "@/components/ui/character-mascot";
import { useCharacterReaction } from "@/lib/hooks/useCharacterReaction";
import { SpecialtyPickerDialog } from "./specialty-picker-dialog";

const ARROW_BOUNCE_ANIMATION = {
  animate: { x: [0, 4, 0] },
  transition: { duration: 1.5, repeat: Infinity },
};

const MENTOR_CHARACTERS: Record<
  string,
  {
    name: string;
    title: string;
    description: string;
    image: string;
  }
> = {
  tech: {
    name: "Dok",
    title: "Senior Software Engineer",
    description:
      "10 năm kinh nghiệm với các công nghệ web, mobile, và hệ thống phân tán",
    image: "/assets/dok.png",
  },
  marketing: {
    name: "Sarah Growth",
    title: "Growth Marketing Lead",
    description:
      "Chuyên gia trong SEO, quảng cáo, và chiến lược tiếp cận khách hàng",
    image: "/assets/dok.png",
  },
  design: {
    name: "Emma Design",
    title: "Product Designer",
    description:
      "Chuyên tạo những trải nghiệm người dùng tuyệt vời và giao diện intuitive",
    image: "/assets/dok.png",
  },
};

export function MentorCharacterSection({
  selectedDomain,
}: {
  selectedDomain: string | null;
  reduced: boolean;
}) {
  const router = useRouter();
  const { t } = useLocale();
  const [displayedMentor, setDisplayedMentor] = useState<string | null>(null);
  const [isSpecialtyPickerOpen, setIsSpecialtyPickerOpen] = useState(false);
  const { reaction, happy } = useCharacterReaction();

  useEffect(() => {
    if (selectedDomain) {
      setDisplayedMentor(selectedDomain);
      // Mascot waves when domain is selected
      happy();
    }
  }, [selectedDomain, happy]);

  const mentor =
    displayedMentor && MENTOR_CHARACTERS[displayedMentor]
      ? MENTOR_CHARACTERS[displayedMentor]
      : null;
  const domain = displayedMentor ? domains.find((d) => d.id === displayedMentor) : null;
  const isLocked = !selectedDomain;

  const handleGetStarted = () => {
    if (displayedMentor) {
      router.push(`/fields/${displayedMentor}`);
    }
  };

  const handleMascotClick = () => {
    if (!isLocked) {
      happy();
    }
  };

  return (
    <>
      <section className={styles.root}>
        <div className={styles.container}>
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.div
                key="locked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.lockedState}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className={styles.lockIcon}>🔒</div>
                </motion.div>
                <p className={styles.lockedText}>{t.home.mentor.selectFieldPrompt}</p>
              </motion.div>
            ) : mentor && domain ? (
              <motion.div
                key={displayedMentor}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.base }}
                className={styles.card}
              >
                {/* Character Mascot - Interactive */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: DURATION.deliberate, ease: "easeOut" }}
                  className={cn(styles.characterImage, "cursor-pointer")}
                  onClick={handleMascotClick}
                >
                  <CharacterMascot
                    size="lg"
                    reaction={reaction}
                    autoIdle={true}
                  />
                </motion.div>

                {/* Content */}
                <div className={styles.content}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: DURATION.base,
                      delay: DURATION.quick,
                    }}
                  >
                    <h3 className={styles.mentorName}>{mentor.name}</h3>
                    <p className={styles.mentorTitle}>{mentor.title}</p>
                    <p className={styles.mentorDescription}>
                      {mentor.description}
                    </p>
                  </motion.div>

                  <motion.button
                    onClick={handleGetStarted}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: DURATION.base,
                      delay: DURATION.base,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={styles.ctaButton}
                    style={{
                      backgroundColor: domain.theme.badgeBg,
                    }}
                  >
                    {formatMessage(t.home.mentor.startWithMentor, { mentorName: mentor.name })}
                    <motion.span
                      {...ARROW_BOUNCE_ANIMATION}
                      className="inline-block"
                    >
                      →
                    </motion.span>
                  </motion.button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>

      <SpecialtyPickerDialog
        open={isSpecialtyPickerOpen}
        onOpenChange={setIsSpecialtyPickerOpen}
      />
    </>
  );
}
