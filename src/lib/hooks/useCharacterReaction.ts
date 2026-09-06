import { useState, useCallback } from "react";

type CharacterReaction = "idle" | "happy" | "confused" | "celebrate" | "thinking";

export function useCharacterReaction() {
  const [reaction, setReaction] = useState<CharacterReaction>("idle");
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerReaction = useCallback(
    (newReaction: CharacterReaction, duration = 1000) => {
      if (newReaction === "idle") {
        setReaction("idle");
        setIsAnimating(false);
        return;
      }

      setReaction(newReaction);
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setReaction("idle");
        setIsAnimating(false);
      }, duration);

      return () => clearTimeout(timer);
    },
    []
  );

  const correct = useCallback(
    () => triggerReaction("celebrate", 1200),
    [triggerReaction]
  );

  const incorrect = useCallback(
    () => triggerReaction("confused", 800),
    [triggerReaction]
  );

  const thinking = useCallback(
    () => triggerReaction("thinking", 2500),
    [triggerReaction]
  );

  const happy = useCallback(
    () => triggerReaction("happy", 600),
    [triggerReaction]
  );

  return {
    reaction,
    isAnimating,
    triggerReaction,
    correct,
    incorrect,
    thinking,
    happy,
  };
}
