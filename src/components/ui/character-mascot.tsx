import * as React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type CharacterReaction = "idle" | "happy" | "confused" | "celebrate" | "thinking";

export interface CharacterMascotProps {
  size?: "sm" | "md" | "lg" | "xl";
  reaction?: CharacterReaction;
  onReactionEnd?: () => void;
  className?: string;
  autoIdle?: boolean;
}

const sizeMap = {
  sm: "w-24 h-36",
  md: "w-32 h-48",
  lg: "w-48 h-52",
  xl: "w-64 h-96",
};

const floatVariants: Variants = {
  idle: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const reactionVariants: Variants = {
  happy: {
    scale: [1, 1.05, 1],
    rotate: [0, -2, 2, -2, 0],
    y: [0, -12, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut" as const,
    },
  },
  celebrate: {
    scale: [1, 1.08, 0.95, 1.05, 1],
    rotate: [0, -5, 5, -5, 0],
    y: [0, -20, -10, -15, 0],
    transition: {
      duration: 1,
      ease: "easeInOut" as const,
    },
  },
  confused: {
    rotate: [0, -3, 3, -3, 0],
    x: [0, -4, 4, -4, 0],
    transition: {
      duration: 0.8,
      ease: "easeInOut" as const,
    },
  },
  thinking: {
    scale: [1, 0.98, 1],
    y: [0, 4, 0],
    transition: {
      duration: 2,
      repeat: 2,
      ease: "easeInOut" as const,
    },
  },
};

export const CharacterMascot = React.forwardRef<
  HTMLDivElement,
  CharacterMascotProps
>(
  (
    {
      size = "md",
      reaction = "idle",
      onReactionEnd,
      className,
      autoIdle = true,
    },
    ref
  ) => {
    const [currentReaction, setCurrentReaction] =
      React.useState<CharacterReaction>(reaction);

    React.useEffect(() => {
      setCurrentReaction(reaction);
    }, [reaction]);

    const handleAnimationComplete = () => {
      if (reaction !== "idle" && autoIdle) {
        setCurrentReaction("idle");
      }
      onReactionEnd?.();
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center justify-center",
          sizeMap[size],
          className
        )}
        data-slot="character-mascot"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentReaction}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.img
              src="/assets/dok.png"
              alt="Character Mascot"
              className="w-full h-full object-contain drop-shadow-lg"
              variants={
                currentReaction === "idle"
                  ? floatVariants
                  : reactionVariants
              }
              initial={currentReaction === "idle" ? "idle" : undefined}
              animate={currentReaction === "idle" ? "idle" : currentReaction}
              onAnimationComplete={
                currentReaction !== "idle" ? handleAnimationComplete : undefined
              }
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Optional: Sparkle effect on celebrate */}
        <AnimatePresence>
          {currentReaction === "celebrate" && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  initial={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    opacity: 0,
                    scale: 0,
                    x: Math.cos((i / 4) * Math.PI * 2) * 60,
                    y: Math.sin((i / 4) * Math.PI * 2) * 60,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full pointer-events-none"
                  style={{
                    left: "50%",
                    top: "50%",
                    marginLeft: "-4px",
                    marginTop: "-4px",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

CharacterMascot.displayName = "CharacterMascot";
