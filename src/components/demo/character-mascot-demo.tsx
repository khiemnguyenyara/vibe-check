"use client";

import { useRef } from "react";
import { CharacterMascot } from "@/components/ui/character-mascot";
import { useCharacterReaction } from "@/lib/hooks/useCharacterReaction";
import { Button } from "@/components/ui/button";

export function CharacterMascotDemo() {
  const mascotRef = useRef<HTMLDivElement>(null);
  const {
    reaction,
    isAnimating,
    correct,
    incorrect,
    thinking,
    happy,
    triggerReaction,
  } = useCharacterReaction();

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      {/* Character Display */}
      <div className="relative w-full flex justify-center">
        <CharacterMascot
          ref={mascotRef}
          size="lg"
          reaction={reaction}
          autoIdle={true}
        />
      </div>

      {/* Status Display */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Current Reaction: <span className="font-medium text-foreground">{reaction}</span></p>
        {isAnimating && <p className="text-xs mt-1">Animating...</p>}
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        <Button
          onClick={correct}
          disabled={isAnimating}
          variant="default"
          size="sm"
        >
          ✓ Correct Answer
        </Button>

        <Button
          onClick={incorrect}
          disabled={isAnimating}
          variant="outline"
          size="sm"
        >
          ✗ Wrong Answer
        </Button>

        <Button
          onClick={thinking}
          disabled={isAnimating}
          variant="outline"
          size="sm"
        >
          💭 Thinking
        </Button>

        <Button
          onClick={happy}
          disabled={isAnimating}
          variant="outline"
          size="sm"
        >
          😊 Happy
        </Button>

        <Button
          onClick={() => triggerReaction("idle")}
          disabled={!isAnimating && reaction === "idle"}
          variant="ghost"
          size="sm"
          className="col-span-2"
        >
          Reset to Idle
        </Button>
      </div>

      {/* Size Variants */}
      <div className="w-full border-t pt-8">
        <h3 className="text-sm font-medium mb-4">Size Variants</h3>
        <div className="grid grid-cols-4 gap-4 justify-items-center">
          <div className="text-center">
            <CharacterMascot size="sm" />
            <p className="text-xs text-muted-foreground mt-2">Small</p>
          </div>
          <div className="text-center">
            <CharacterMascot size="md" />
            <p className="text-xs text-muted-foreground mt-2">Medium</p>
          </div>
          <div className="text-center">
            <CharacterMascot size="lg" />
            <p className="text-xs text-muted-foreground mt-2">Large</p>
          </div>
          <div className="text-center">
            <CharacterMascot size="xl" />
            <p className="text-xs text-muted-foreground mt-2">XL</p>
          </div>
        </div>
      </div>

      {/* Integration Examples */}
      <div className="w-full border-t pt-8">
        <h3 className="text-sm font-medium mb-4">Integration Examples</h3>
        <div className="space-y-4 text-xs text-muted-foreground">
          <div className="bg-muted/30 p-3 rounded-lg font-mono">
            <p className="font-medium text-foreground mb-2">Hook Usage:</p>
            <pre className="overflow-x-auto text-[11px]">{`const { reaction, correct, incorrect } = useCharacterReaction();

<CharacterMascot reaction={reaction} />
<button onClick={correct}>Submit Answer</button>`}</pre>
          </div>

          <div className="bg-muted/30 p-3 rounded-lg font-mono">
            <p className="font-medium text-foreground mb-2">Direct Animation:</p>
            <pre className="overflow-x-auto text-[11px]">{`const mascotRef = useRef();

const handleQuestionAnswered = (isCorrect) => {
  if (isCorrect) mascotRef.current?.triggerReaction('celebrate');
  else mascotRef.current?.triggerReaction('confused');
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
