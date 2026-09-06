# Character Mascot — Quick Start Card

## 5-Minute Setup

### 1. Copy Component
✅ Already created at `src/components/ui/character-mascot.tsx`

### 2. Copy Hook
✅ Already created at `src/lib/hooks/useCharacterReaction.ts`

### 3. Import in Your Page
```tsx
import { CharacterMascot } from "@/components/ui/character-mascot";
import { useCharacterReaction } from "@/lib/hooks/useCharacterReaction";
```

### 4. Add to Template
```tsx
export function MyInterviewPage() {
  const { reaction, correct, incorrect } = useCharacterReaction();

  return (
    <>
      <CharacterMascot size="lg" reaction={reaction} />
      <button onClick={correct}>Correct!</button>
      <button onClick={incorrect}>Wrong!</button>
    </>
  );
}
```

---

## Cheat Sheet

### Reactions
```tsx
correct()      // 🎉 Celebrate animation (1.2s)
incorrect()    // 🤔 Confused head shake (0.8s)
thinking()     // ⏳ Contemplative bob (2.5s)
happy()        // 😊 Happy bounce (0.6s)
```

### Sizes
```tsx
size="sm"   // w-24 h-36   (small widget)
size="md"   // w-32 h-48   (default)
size="lg"   // w-48 h-72   (interview main)
size="xl"   // w-64 h-96   (full screen)
```

### State Access
```tsx
const { 
  reaction,      // Current: 'idle' | 'happy' | ...
  isAnimating,   // true while animation plays
  correct,       // () => void
  incorrect,     // () => void
  thinking,      // () => void
  happy,         // () => void
  triggerReaction// (reaction, duration) => void
} = useCharacterReaction();
```

---

## Common Patterns

### Pattern A: Answer Feedback
```tsx
const handleSubmit = async (answer) => {
  const result = await api.checkAnswer(answer);
  result.correct ? correct() : incorrect();
};
```

### Pattern B: Processing State
```tsx
const requestHint = () => {
  thinking();
  fetchHint().then(showHint);
};
```

### Pattern C: Timed Auto-Return
```tsx
const correct = () => {
  triggerReaction("celebrate", 1200); // Auto-returns to idle
};
```

### Pattern D: Responsive Layout
```tsx
<div className="grid lg:grid-cols-3 gap-4">
  <div className="hidden lg:flex">           {/* Desktop */}
    <CharacterMascot size="lg" reaction={reaction} />
  </div>
  <div className="lg:col-span-2">
    <ChatPane />
  </div>
  <div className="lg:hidden flex justify-center"> {/* Mobile */}
    <CharacterMascot size="sm" reaction={reaction} />
  </div>
</div>
```

---

## Files Created

| File | Purpose | Lines |
|------|---------|-------|
| `src/components/ui/character-mascot.tsx` | Main component | ~140 |
| `src/lib/hooks/useCharacterReaction.ts` | State hook | ~40 |
| `src/components/demo/character-mascot-demo.tsx` | Interactive demo | ~100 |
| `src/components/interview/interview-with-mascot.tsx` | Interview layout | ~120 |
| `src/components/interview/chat-pane-with-mascot.example.tsx` | Integration patterns | ~200 |
| `CHARACTER_MASCOT_GUIDE.md` | Full documentation | ~300 |
| `CHARACTER_MASCOT_IMPLEMENTATION_SUMMARY.md` | Overview | ~400 |

---

## Minimal Example

```tsx
"use client";
import { CharacterMascot } from "@/components/ui/character-mascot";
import { useCharacterReaction } from "@/lib/hooks/useCharacterReaction";

export default function Page() {
  const { reaction, correct, incorrect } = useCharacterReaction();

  return (
    <div className="flex gap-8 items-center p-8">
      <CharacterMascot size="lg" reaction={reaction} />
      <div>
        <button onClick={correct} className="block mb-2 px-4 py-2 bg-green-600 text-white rounded">
          ✓ Correct
        </button>
        <button onClick={incorrect} className="px-4 py-2 bg-red-600 text-white rounded">
          ✗ Incorrect
        </button>
      </div>
    </div>
  );
}
```

✅ That's it! 

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Image not showing | Check `public/assets/dok.png` exists |
| Animations stuttering | Verify `framer-motion` installed: `npm ls framer-motion` |
| State not updating | Add `"use client"` directive at top of file |
| Mobile layout broken | Check Tailwind responsive classes working |

---

## Next Steps

1. **Test it** → Import in a test page
2. **Customize** → Adjust animation speeds in `character-mascot.tsx`
3. **Integrate** → Add to your interview workflow
4. **Iterate** → Gather user feedback and refine

---

## Full Documentation

- 📘 **Guide**: `CHARACTER_MASCOT_GUIDE.md`
- 📊 **Summary**: `CHARACTER_MASCOT_IMPLEMENTATION_SUMMARY.md`
- 🎮 **Demo**: `src/components/demo/character-mascot-demo.tsx`
- 💡 **Examples**: `src/components/interview/chat-pane-with-mascot.example.tsx`

---

**Questions?** Check the full guide or review example implementations.
