# Character Mascot Integration Guide

## Overview
The `CharacterMascot` component is a reusable, animated character component inspired by Duolingo mascots. It supports multiple interactive reactions and responsive sizing.

## Installation & Location
- **Component**: `src/components/ui/character-mascot.tsx`
- **Hook**: `src/lib/hooks/useCharacterReaction.ts`
- **Demo**: `src/components/demo/character-mascot-demo.tsx`
- **Asset**: `public/assets/dok.png`

## Quick Start

### 1. Basic Usage
```tsx
import { CharacterMascot } from "@/components/ui/character-mascot";

export function MyComponent() {
  return (
    <CharacterMascot 
      size="lg" 
      reaction="idle"
    />
  );
}
```

### 2. With Hook for Programmatic Control
```tsx
"use client";

import { CharacterMascot } from "@/components/ui/character-mascot";
import { useCharacterReaction } from "@/lib/hooks/useCharacterReaction";
import { Button } from "@/components/ui/button";

export function InterviewChat() {
  const { reaction, correct, incorrect } = useCharacterReaction();

  return (
    <>
      <CharacterMascot reaction={reaction} size="lg" />
      
      <button onClick={correct}>Submit Correct Answer</button>
      <button onClick={incorrect}>Submit Wrong Answer</button>
    </>
  );
}
```

### 3. With Ref for Imperative Control
```tsx
import { useRef } from "react";
import { CharacterMascot } from "@/components/ui/character-mascot";

export function InterviewModule() {
  const mascotRef = useRef<HTMLDivElement>(null);

  const handleAnswerSubmitted = (isCorrect: boolean) => {
    // Trigger reaction programmatically
    if (isCorrect) {
      // Component has internal state management with useCharacterReaction hook
    }
  };

  return <CharacterMascot ref={mascotRef} size="lg" />;
}
```

## Available Reactions

| Reaction | Trigger | Use Case |
|----------|---------|----------|
| `idle` | Default | Base state with gentle floating animation |
| `happy` | User interaction | Light positive feedback, encouragement |
| `celebrate` | Correct answer | Major celebration with spinning and sparkles |
| `confused` | Wrong answer | Gentle confusion shake, prompts thinking |
| `thinking` | Hint/Processing | Indicates character is pondering |

## Size Options

```tsx
<CharacterMascot size="sm" />   {/* w-24 h-36 */}
<CharacterMascot size="md" />   {/* w-32 h-48 - default */}
<CharacterMascot size="lg" />   {/* w-48 h-72 */}
<CharacterMascot size="xl" />   {/* w-64 h-96 */}
```

## Hook API: `useCharacterReaction`

```tsx
const {
  // State
  reaction,        // Current reaction: 'idle' | 'happy' | 'confused' | 'celebrate' | 'thinking'
  isAnimating,     // Boolean: true while animating

  // Methods
  triggerReaction, // (reaction, duration?) => void
  correct,         // () => void - triggers 'celebrate' for 1.2s
  incorrect,       // () => void - triggers 'confused' for 0.8s
  thinking,        // () => void - triggers 'thinking' for 2.5s
  happy,           // () => void - triggers 'happy' for 0.6s
} = useCharacterReaction();
```

## Props

### CharacterMascotProps
```typescript
{
  // Size preset (default: "md")
  size?: "sm" | "md" | "lg" | "xl";

  // Current reaction to display
  reaction?: "idle" | "happy" | "confused" | "celebrate" | "thinking";

  // Callback when reaction animation completes
  onReactionEnd?: () => void;

  // Additional CSS classes
  className?: string;

  // Auto-return to idle after reaction (default: true)
  autoIdle?: boolean;
}
```

## Integration with Interview Module

### Example: Interview Chat Integration
```tsx
// src/modules/tech/workspace.tsx
"use client";

import { CharacterMascot } from "@/components/ui/character-mascot";
import { useCharacterReaction } from "@/lib/hooks/useCharacterReaction";

export function TechInterviewWorkspace() {
  const { reaction, correct, incorrect } = useCharacterReaction();

  const handleSubmitAnswer = async (answer: string) => {
    try {
      const result = await checkAnswer(answer);
      if (result.isCorrect) {
        correct(); // Triggers celebration
      } else {
        incorrect(); // Triggers confused state
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 h-screen">
      {/* Left: Character */}
      <div className="flex items-center justify-center border-r">
        <CharacterMascot reaction={reaction} size="lg" />
      </div>

      {/* Center: Chat/Questions */}
      <div className="col-span-2 overflow-auto p-4">
        <ChatMessages />
        <AnswerInput onSubmit={handleSubmitAnswer} />
      </div>
    </div>
  );
}
```

### Example: As Floating Corner Element
```tsx
<div className="fixed bottom-4 right-4">
  <CharacterMascot size="sm" />
</div>
```

## Animation Customization

To customize animations, edit the `reactionVariants` in `character-mascot.tsx`:

```tsx
const reactionVariants = {
  celebrate: {
    scale: [1, 1.08, 0.95, 1.05, 1],        // Scale keyframes
    rotate: [0, -5, 5, -5, 0],              // Rotation keyframes
    y: [0, -20, -10, -15, 0],               // Vertical movement
    transition: {
      duration: 1,                          // Total duration
      ease: "easeInOut",
    },
  },
  // ... other reactions
};
```

## Performance Notes

- ✅ Uses Framer Motion's optimized rendering
- ✅ Image is properly optimized (1024x1536 PNG)
- ✅ Animations are GPU-accelerated (`transform` and `opacity`)
- ✅ No heavy filters in production (sparkles only on celebrate)
- ✅ Responsive sizing with Tailwind classes

## Accessibility

- Image has `alt="Character Mascot"` for screen readers
- Animations respect `prefers-reduced-motion`
- Component is keyboard accessible when used in interactive contexts
- All buttons/triggers should have proper labels

## Browser Support

- Uses Framer Motion (supports all modern browsers)
- CSS animations via Tailwind (IE11+ with PostCSS)
- PNG image format (universal support)

## Troubleshooting

### Image not loading
- Check `public/assets/dok.png` exists
- Verify path is correct: `/assets/dok.png`
- Clear Next.js cache: `rm -rf .next`

### Animation stuttering
- Check Framer Motion version: `^12.42.2`
- Ensure component isn't re-rendering unnecessarily
- Use `React.memo` if wrapping in multiple parent components

### State not updating
- Ensure component is marked as `"use client"` if using hook
- Check `useCharacterReaction` duration matches animation timing
- Verify `autoIdle` is `true` for auto-reset behavior

## Example Usage in Interview Flow

```tsx
// Trigger correct answer celebration
onAnswerSubmit={async (answer) => {
  const isCorrect = await verifyAnswer(answer);
  if (isCorrect) {
    correct(); // Mascot celebrates for 1.2s
    setTimeout(() => nextQuestion(), 1500);
  } else {
    incorrect(); // Mascot looks confused
  }
}}
```
