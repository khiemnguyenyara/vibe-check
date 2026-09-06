"use client";

/**
 * EXAMPLE: Enhanced ChatPane with CharacterMascot Feedback
 *
 * This file demonstrates how to integrate the CharacterMascot component
 * into your existing chat-pane.tsx component.
 *
 * To use this:
 * 1. Copy relevant logic to your actual chat-pane.tsx
 * 2. Import CharacterMascot and useCharacterReaction
 * 3. Add mascot container to your layout
 * 4. Trigger reactions on answer feedback
 */

import { useRef, useState, useCallback } from "react";
import { CharacterMascot } from "@/components/ui/character-mascot";
import { useCharacterReaction } from "@/lib/hooks/useCharacterReaction";

interface Message {
  role: "user" | "assistant";
  content: string;
  feedback?: "correct" | "incorrect" | "neutral";
}

export function ChatPaneWithMascotExample() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { reaction, isAnimating, correct, incorrect, thinking } =
    useCharacterReaction();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Pattern 1: React to answer feedback immediately
   * Trigger mascot reaction when feedback is received
   */
  const handleAnswerFeedback = useCallback(
    async (answer: string, isCorrect: boolean) => {
      setIsSubmitting(true);

      try {
        // Add user message
        setMessages((prev) => [
          ...prev,
          { role: "user", content: answer, feedback: isCorrect ? "correct" : "incorrect" },
        ]);

        // Trigger mascot reaction
        if (isCorrect) {
          correct();
          // Wait for celebration animation to complete
          await new Promise((resolve) => setTimeout(resolve, 1200));
        } else {
          incorrect();
          await new Promise((resolve) => setTimeout(resolve, 800));
        }

        // Simulate getting mentor feedback
        const feedbackMessage = isCorrect
          ? "Excellent answer! You really understand this concept."
          : "Not quite right. Let me explain further...";

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: feedbackMessage },
        ]);
      } finally {
        setIsSubmitting(false);
      }
    },
    [correct, incorrect]
  );

  /**
   * Pattern 2: Show mascot thinking during processing
   */
  const handleSubmitAnswer = useCallback(
    async (answer: string) => {
      thinking();

      // Simulate API call
      const mockDelay = new Promise((resolve) => setTimeout(resolve, 2500));
      const isCorrect = Math.random() > 0.5; // Mock evaluation

      await mockDelay;

      handleAnswerFeedback(answer, isCorrect);
    },
    [thinking, handleAnswerFeedback]
  );

  /**
   * Pattern 3: Coordinate timing between mascot and UI
   */
  const handleNextQuestion = useCallback(async () => {
    // Only proceed if mascot animation is done
    if (isAnimating) {
      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!isAnimating) {
            clearInterval(checkInterval);
            resolve(null);
          }
        }, 100);
      });
    }

    // Clear messages and show new question
    setMessages([]);
    // Load next question from server...
  }, [isAnimating]);

  return (
    <div className="grid grid-cols-[auto_1fr] gap-6 h-full">
      {/* Character Column */}
      <div className="hidden md:flex flex-col items-center gap-4 pt-8">
        <CharacterMascot size="lg" reaction={reaction} />

        {/* Animation Status Indicator */}
        {isAnimating && (
          <div className="text-xs text-center text-muted-foreground space-y-1">
            {reaction === "celebrate" && (
              <>
                <div className="text-lg">🎉</div>
                <p>Excellent!</p>
              </>
            )}
            {reaction === "confused" && (
              <>
                <div className="text-lg">🤔</div>
                <p>Try again</p>
              </>
            )}
            {reaction === "thinking" && (
              <>
                <div className="text-lg animate-spin">⏳</div>
                <p>Processing...</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Chat Column */}
      <div className="flex flex-col gap-4 h-full">
        {/* Mobile Mascot */}
        <div className="md:hidden flex justify-center mb-4">
          <CharacterMascot size="sm" reaction={reaction} />
        </div>

        {/* Messages Area */}
        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-auto space-y-4 p-4 bg-muted/30 rounded-lg"
        >
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground pt-8">
              <p>Welcome to your interview!</p>
              <p className="text-xs mt-2">
                Read the question carefully and submit your answer.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p>{msg.content}</p>
                  {msg.feedback && (
                    <p className="text-xs mt-1 opacity-75">
                      {msg.feedback === "correct" ? "✓ Correct" : "✗ Incorrect"}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your answer..."
            onKeyPress={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                handleSubmitAnswer(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 rounded border disabled:opacity-50"
          />
          <button
            onClick={() => handleNextQuestion()}
            disabled={isSubmitting || isAnimating}
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/80 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * KEY INTEGRATION PATTERNS:
 *
 * 1. IMMEDIATE FEEDBACK
 *    - Show mascot reaction as soon as answer is judged
 *    - Use correct() or incorrect() based on evaluation result
 *    - Let animation complete before next question
 *
 * 2. PROCESSING STATE
 *    - Call thinking() while evaluating answer
 *    - Shows mascot is processing, improves UX
 *    - Prevents user interaction during processing
 *
 * 3. TIMING COORDINATION
 *    - Track isAnimating state to sync UI updates
 *    - Wait for animation to complete before advancing
 *    - Prevents jarring transitions
 *
 * 4. RESPONSIVE BEHAVIOR
 *    - Hide mascot on mobile (save space)
 *    - Show smaller version on tablet
 *    - Full size on desktop
 *
 * 5. ACCESSIBILITY
 *    - Disable buttons while animating (prevents double-submission)
 *    - Respect prefers-reduced-motion
 *    - Provide text labels alongside animations
 */
