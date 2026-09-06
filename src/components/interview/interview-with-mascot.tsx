"use client";

import React, { useState } from "react";
import { CharacterMascot } from "@/components/ui/character-mascot";
import { useCharacterReaction } from "@/lib/hooks/useCharacterReaction";
import { Card } from "@/components/ui/card";

/**
 * Integration pattern for embedding CharacterMascot in interview flow.
 *
 * This component shows how to:
 * 1. Trigger mascot reactions based on answer feedback
 * 2. Coordinate timing between mascot animation and UI state changes
 * 3. Handle multiple reaction types (correct, incorrect, thinking)
 */

interface InterviewWithMascotProps {
  chatContent?: React.ReactNode;
  onAnswerSubmit?: (answer: string) => Promise<boolean>;
  showMascot?: boolean;
  mascotSize?: "sm" | "md" | "lg" | "xl";
}

export function InterviewWithMascot({
  chatContent,
  onAnswerSubmit,
  showMascot = true,
  mascotSize = "lg",
}: InterviewWithMascotProps) {
  const { reaction, isAnimating, correct, incorrect, thinking } =
    useCharacterReaction();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFeedback = async (feedback: "correct" | "incorrect") => {
    setIsProcessing(true);

    if (feedback === "correct") {
      correct();
      // Keep processing state true during mascot animation
      await new Promise((resolve) => setTimeout(resolve, 1200));
    } else {
      incorrect();
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setIsProcessing(false);
  };

  const triggerThinking = () => {
    thinking();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
      {/* Left Column: Character Mascot */}
      {showMascot && (
        <div className="hidden lg:flex flex-col items-center justify-start pt-8 border-r">
          <CharacterMascot
            size={mascotSize}
            reaction={reaction}
            autoIdle={true}
            className="mb-4"
          />

          {/* Feedback Indicators */}
          {isAnimating && (
            <div className="text-xs text-center text-muted-foreground">
              {reaction === "celebrate" && "Great job! 🎉"}
              {reaction === "confused" && "Think again... 🤔"}
              {reaction === "thinking" && "Processing... ⏳"}
            </div>
          )}
        </div>
      )}

      {/* Main Content Column */}
      <div className={`${showMascot ? "lg:col-span-2" : "col-span-1"} flex flex-col`}>
        {/* Chat/Content Area */}
        <div className="flex-1 overflow-auto">
          {chatContent || (
            <Card className="p-6">
              <p className="text-muted-foreground">
                Interview content goes here
              </p>
            </Card>
          )}
        </div>

        {/* Control Bar */}
        <div className="border-t pt-4 flex gap-2 flex-wrap">
          <button
            onClick={() => handleFeedback("correct")}
            disabled={isProcessing}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            ✓ Mark Correct
          </button>

          <button
            onClick={() => handleFeedback("incorrect")}
            disabled={isProcessing}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            ✗ Mark Incorrect
          </button>

          <button
            onClick={triggerThinking}
            disabled={isAnimating}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            💭 Show Thinking
          </button>
        </div>
      </div>

      {/* Mobile Mascot: Top Center */}
      {showMascot && (
        <div className="lg:hidden flex flex-col items-center justify-center mb-4">
          <CharacterMascot
            size="sm"
            reaction={reaction}
            autoIdle={true}
            className="mb-2"
          />
          {isAnimating && (
            <span className="text-xs text-muted-foreground">
              {reaction === "celebrate" && "Great job! 🎉"}
              {reaction === "confused" && "Think again... 🤔"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Usage in Interview Page:
 *
 * import { InterviewWithMascot } from '@/components/interview/interview-with-mascot';
 * import { ChatPane } from '@/components/interview/chat-pane';
 *
 * export default function InterviewPage() {
 *   return (
 *     <InterviewWithMascot
 *       chatContent={<ChatPane />}
 *       showMascot={true}
 *       mascotSize="lg"
 *     />
 *   );
 * }
 */
