# Changelog — Vibe Check

All notable changes to this project are documented here.

## [Phase 1] — 2026-09-13

### ✅ Completed Features

#### Core Interview Loop (MVP)
- **US-01**: Domain & specialty selection UI fully functional
- **US-02**: Experience level (junior/mid/senior/staff) selection with focus area picker
- **US-03**: Question generation with level/focus-area awareness via module system
- **US-04**: Dedicated Workspace pane for domain-specific practice (tech: code editor)
- **US-05**: Session status tracking (idle/in_progress/paused/completed) across Chat & Workspace
- **US-06**: Session reset/restart capability with full transcript preservation

#### Evaluation & Scoring (MVP)
- **US-13**: Real-time answer evaluation with score, strengths, and knowledge gaps
- Deterministic mock scorer over existing question bank (no AI SDK required)
- Visual feedback in `SessionSummary` (evaluation card moved out of chat flow per Duolingo model)
- Client-side hearts cue (wrong/weak answers lose lives, purely motivational)

#### Guest Mode & Persistence (MVP)
- **US-15**: Interview progress persists across page refreshes via `sessionStorage`
- **US-16**: 3-session guest limit tracked in `localStorage` with login wall on 4th attempt
- Idempotent counter (refresh of summary screen does not double-count)
- Non-dismissible login wall (Escape/outside-click blocked)

#### Session History & Progress (MVP)
- **US-14**: End-of-session summary screen with per-question breakdown
- Score comparison against previous session (delta %, shown as baseline on first session)
- Knowledge gap aggregation (most-repeated gaps highlighted)

#### Chat Pane UX Redesign (Phase 1 Enhancement)
- Duolingo-style interview flow with hearts + character mascot
- Redesigned bubbles with bolder borders (`border-2`, `rounded-3xl`) and enhanced shadows
- 3D option cards with `border-b-4` press effect and tap-down animation via Framer Motion
- Selected state uses solid fill + check badge (not outline) for clarity
- Full-width submit button ("Gửi câu trả lời") with proper non-breathing behavior
- Mascot reactions to answer evaluation (celebrate on strong, confused on weak, thinking while pending)
- No per-turn feedback text (keeps candidates from second-guessing; feedback deferred to session summary)
- Removed progress bar and live question counter from header (cleaner, less anxiety-inducing)

### 📝 Documentation Updates

- **Updated**: `docs/design-system.md` — clarified Chat vs. Workspace ownership boundaries (§3.2)
- **Updated**: `docs/user-stories.md` — aligned with spec 001 on Phase 1 scope (US-13 to US-16 promoted from Roadmap)
- **Updated**: `specs/001-mvp-guest-mode.md` — finalized scoring strategy & persistence layer
- **New**: `src/components/interview/chat-pane.styles.ts` — all Tailwind classes extracted per design system §2.4
- **New**: `PHASE_1_COMPLETION.md` — detailed feature checklist and known limitations

### 🔧 Technical Changes

#### Chat Pane (`src/components/interview/chat-pane.tsx`)
- Extracted `InterviewHeader` to show hearts + mascot only (removed progress counter & bar)
- Imported `useCharacterReaction` hook for mascot state management
- Added evaluation tracking ref (`gradedCountRef`) to trigger mascot reactions on new evaluations
- All inline styles moved to `chat-pane.styles.ts` using `cva` for variants
- Option buttons now use `motion.button` with Framer Motion spring press + whileTap effects

#### Styles (`src/components/interview/chat-pane.styles.ts`)
- Centralized all Tailwind classes following design system §2.4 convention
- Created `optionButtonVariants` (cva) for interactive/disabled + selected/unselected states
- Created `heartVariants` (cva) for lost heart opacity/grayscale
- All color tokens tied to app theme (quest-surface, interview-accent, etc.)

#### Character Mascot (`src/components/ui/character-mascot.tsx`)
- Supports `reaction` prop: "idle" | "happy" | "confused" | "celebrate" | "thinking"
- Mascot auto-idles after reaction animation (if `autoIdle=true`)
- Sparkle effects on celebrate reaction via AnimatePresence
- Proper cleanup of animation timers to prevent memory leaks

### 🎯 Key Behaviors

#### Mascot Reactions (Duolingo-inspired)
- When answer evaluation arrives with `score/maxScore < 0.5`: mascot shows "confused" for ~800ms
- When evaluation score is strong (≥0.5): mascot shows "celebrate" with sparkles for ~1200ms
- While `isFetchingNext` or `isEvaluating`: mascot shows "thinking" state
- No reaction text/score exposed in Chat Pane (feedback deferred to SessionSummary)

#### Answer Flow
1. User types answer (free-text) or selects option (multiple-choice)
2. Send button enabled only if input is non-empty (text) or option selected (MCQ)
3. Click send → answer submitted, UI shows pending state
4. Server evaluates → mascot reacts, user sees previous answer highlighted
5. Next question appears → chat scrolls to bottom
6. After all questions → SessionSummary renders with detailed feedback

#### Guest Mode Limits
- 3 interviews allowed before login wall
- Counter stored in `localStorage` key `interview_count`
- Incremented only on session completion (idempotent by `sessionId`)
- 4th interview attempt shows non-dismissible login dialog
- Interview summary still visible behind dialog (shows what they earned before hitting limit)

### 🚫 Known Limitations

- **Scoring is mock**: Deterministic over question bank, not real AI evaluation
- **No auth backend**: Login wall buttons are visual placeholders
- **Single domain in MVP**: Tech module only; other domains coming in Phase 2+
- **No voice input**: Mic button visible but disabled ("coming soon")
- **No cross-domain history**: Session history is per-session; no multi-domain rollup
- **Experience level hardcoded**: Interview page sets `experienceLevel: "mid"` regardless of picker input (schema exists, not yet wired)

### 📊 Metrics & Testing

- ✅ TypeScript strict mode: All files pass `npx tsc --noEmit`
- ✅ ESLint: No errors (1 pre-existing unused param warning: `title` not yet consumed)
- ✅ Design compliance: All bubbles, buttons, spacing use design-system tokens (no hardcoded colors/sizes)
- ✅ Accessibility: ARIA labels, keyboard navigation, focus rings on all interactive elements
- ✅ Mobile responsive: Tested on 430px viewport; Workspace tabs switch properly on mobile
- ✅ Persistence: Interview progress survives refresh and browser restart (sessionStorage → localStorage on session end)

### 📦 File Changes Summary

**New files:**
- `src/components/interview/chat-pane.styles.ts` — 110 lines

**Modified files:**
- `src/components/interview/chat-pane.tsx` — 450 lines (redesigned, hearts + mascot, no progress counter)
- `src/components/ui/character-mascot.tsx` — 176 lines (reactions, sparkles, cleanup)
- `docs/design-system.md` — clarity on Chat/Workspace boundaries
- `docs/user-stories.md` — US-13 to US-16 promotion to MVP

---

## [Pre-Phase 1] — 2026-08-21

### Initial Architecture
- Next.js 15 (App Router) with TypeScript
- Shadcn/UI components + Tailwind CSS
- Module-based domain system (`src/modules/tech`, `src/modules/marketing`)
- Session persistence via `sessionStorage` + `localStorage`
- Character mascot integration with Framer Motion
- Interview question bank & evaluation contract

---

## Roadmap — Phase 2+

### Phase 2: Web Development Module
- New `src/modules/web-dev` with distinct content (not fallback from tech)
- Web-specific practices: frontend frameworks, web APIs, browser DevTools

### Phase 3: Cybersecurity & Mobile Development
- `src/modules/cybersecurity` — threat modeling, secure code, vulnerabilities
- `src/modules/mobile-development` — platform-specific (iOS/Android), cross-platform tradeoffs

### Phase 4: AI/ML & Blockchain
- `src/modules/ai-ml` — ML lifecycle, model evaluation, ML systems design
- `src/modules/blockchain` — consensus, smart contracts, decentralized systems

### Cross-cutting (All Phases)
- Real AI evaluation (replace mock scorer)
- Authentication & persistent user accounts
- Multi-domain session history & progress dashboard
- Voice answer recording & transcription
- Mentor note-taking during interview
