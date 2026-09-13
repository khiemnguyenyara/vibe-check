# Vibe Check — AI Mock Interview Platform

**A Duolingo-inspired mock interview platform for technical specialties with real-time scoring and progress tracking.**

![Status](https://img.shields.io/badge/Status-Phase%201%20Complete-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-Private-red)

---

## 🎯 Overview

Vibe Check is a web platform where candidates practice technical interviews in a low-stress environment. The platform adapts questions to experience level and specialty, provides instant feedback, and tracks progress across sessions.

**Key features**:
- 🎤 **Interview loop**: Real-time question generation, instant scoring, knowledge gap analysis
- ❤️ **Duolingo UX**: Hearts system, character mascot reactions, chunky card design
- 💾 **Persistence**: Interview progress survives page refreshes and browser restarts
- 🔐 **Guest mode**: 3 free interviews before login (guest-only MVP; auth backend TBD)
- 📊 **Progress tracking**: Compare session-to-session improvement, spot repeated knowledge gaps
- 🧩 **Modular domains**: Tech (complete), Marketing (scaffolding), Web Dev + more (planned)

### Current State

✅ **Phase 1 (MVP)**: Complete
- 1 domain (Tech) with 6 specialties fully functional
- Real-time evaluation with mock scorer
- Guest mode with 3-session limit & login wall
- Full session persistence

🔄 **Roadmap**: Phases 2–4 in progress (see [CHANGELOG.md](CHANGELOG.md))

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
git clone https://github.com/your-org/vibe-check.git
cd vibe-check
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production

```bash
npm run build
npm start
```

---

## 📖 Documentation

### For Users
- **[Getting Started](docs/hla.md)** — High-level architecture, how data flows
- **[User Stories](docs/user-stories.md)** — Feature scope by phase

### For Engineers
- **[Design System](docs/design-system.md)** — UI/UX conventions, component ownership
- **[Interface Contracts](docs/interface-contracts.md)** — API boundaries between Core & modules
- **[Specs](specs/)** — Implementation details:
  - [001: MVP Scoring & Guest Mode](specs/001-mvp-guest-mode.md)
  - [002: Architecture & API Contracts](specs/002-architecture-and-api-contracts.md)
  - [003: UI/UX Blueprint](specs/003-ui-ux-blueprint.md)

### Project Status
- **[PHASE_1_COMPLETION.md](PHASE_1_COMPLETION.md)** — Detailed feature checklist & deployment readiness
- **[CHANGELOG.md](CHANGELOG.md)** — History & roadmap

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **UI**: Shadcn/UI + Tailwind CSS + Framer Motion
- **State**: React Hooks + Context (no Redux)
- **Storage**: `sessionStorage` (session-level) + `localStorage` (persistent)
- **Animation**: Framer Motion with custom motion vocabulary

### Core Concepts

#### Modules
Each domain (Tech, Marketing, etc.) is a **module** under `src/modules/[domain]/`:
- `index.ts` — Module registration & metadata
- `prompt.ts` — System prompt generation with level/focus-area interpolation
- `workspace.tsx` — Domain-specific practice UI (code editor for Tech, etc.)
- `server/` — Question bank, evaluation scorer, backend logic

#### Session Flow
1. User picks domain → specialty → experience level
2. `useInterviewSession` hook initializes session, fetches Q1
3. ChatPane renders Q, user submits A
4. Answer evaluated (server-side scorer), mascot reacts
5. Repeat until all questions asked
6. SessionSummary shows breakdown & progress delta
7. On complete: interview persisted, session counter incremented

#### Design System
- All bubbles, buttons, spacing use design tokens (`--interview-accent`, `--quest-surface`, etc.)
- No hardcoded colors — theme switches work automatically
- **Chat Pane**: Core-owned, no domain code renders here
- **Workspace Pane**: Domain-owned, Core only provides shell & callbacks

---

## 📁 Project Structure

```
vibe-check/
├── src/
│   ├── app/                           # Next.js App Router pages
│   │   ├── page.tsx                   # Home: domain selection
│   │   ├── interview/[domain]/[specialty]/page.tsx  # Interview shell
│   │   └── api/v1/interview/          # Interview session API routes
│   │
│   ├── components/
│   │   ├── interview/                 # Core interview components
│   │   │   ├── chat-pane.tsx          # Main chat interface (redesigned)
│   │   │   ├── chat-pane.styles.ts    # Centralized Tailwind styles
│   │   │   ├── session-summary.tsx    # End-of-interview breakdown
│   │   │   ├── workspace-pane.tsx     # Domain Workspace shell
│   │   │   └── use-interview-session.ts  # Session state hook
│   │   ├── ui/                        # Shadcn/UI primitives
│   │   ├── home/                      # Homepage components
│   │   └── layout/                    # Shared layout components
│   │
│   ├── modules/
│   │   ├── tech/                      # Tech domain (complete)
│   │   │   ├── index.ts
│   │   │   ├── prompt.ts
│   │   │   ├── workspace.tsx
│   │   │   └── server/
│   │   ├── marketing/                 # Marketing domain (scaffolding)
│   │   └── server-types.ts            # Module type contracts
│   │
│   ├── lib/
│   │   ├── session/                   # Session types & persistence
│   │   ├── api/                       # API contracts & validation
│   │   ├── hooks/                     # Custom React hooks
│   │   │   └── useCharacterReaction.ts
│   │   ├── motion/                    # Framer Motion vocabulary
│   │   ├── avatar.ts                  # Avatar generation
│   │   └── domains.ts                 # Domain registry
│   │
│   ├── styles/
│   │   └── globals.css                # Design tokens & global styles
│   │
│   └── env.ts                         # Environment config validation
│
├── docs/
│   ├── design-system.md               # UI/UX conventions
│   ├── interface-contracts.md         # API boundaries
│   ├── user-stories.md                # Feature scope
│   └── hla.md                         # Architecture overview
│
├── specs/
│   ├── 001-mvp-guest-mode.md         # Scoring & persistence spec
│   ├── 002-architecture-and-api-contracts.md
│   └── 003-ui-ux-blueprint.md
│
├── CHANGELOG.md                       # Release history & roadmap
├── PHASE_1_COMPLETION.md              # Phase 1 feature checklist
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md (this file)
```

---

## 🎮 Usage

### Starting an Interview

1. Visit [http://localhost:3000](http://localhost:3000)
2. Pick a domain (e.g., **Development**)
3. Pick a specialty (e.g., **Mobile Development**)
4. Choose an experience level (junior/mid/senior/staff)
5. Click "Start Interview"

### Interview Loop

- **Free-text questions**: Type your answer, press Enter or click "Gửi câu trả lời"
- **Multiple-choice**: Click an option to select it, then submit
- **After each answer**: Mascot reacts, next question loads automatically
- **On completion**: See your score breakdown and compare to your last session

### Guest Mode

- After 3 completed interviews, you'll see a login wall
- Summary is still visible behind the wall (you can see what you earned)
- Log in / create account to continue (auth backend TBD)

---

## 🛠️ Development

### Adding a New Domain

1. Create `src/modules/[domain-name]/` directory
2. Implement `ModuleDefinition` in `index.ts`:
   ```typescript
   export const myModule: ModuleDefinition = {
     id: "my-domain",
     label: "My Domain",
     specialties: [...],
     // ... required fields
   };
   ```
3. Add prompt generation in `prompt.ts`
4. Build domain-specific Workspace in `workspace.tsx`
5. Register in `src/lib/domains.ts`

See [docs/interface-contracts.md](docs/interface-contracts.md) for full contract.

### Code Style

- **No inline Tailwind**: All classes go in `.styles.ts` files (design-system §2.4)
- **TypeScript strict mode**: No `any`, proper error handling
- **Component ownership**: Core (Chat/Workspace shells) vs. Domain (Workspace content)
- **No hardcoded colors**: Use design tokens (`--interview-accent`, `--quest-surface`, etc.)
- **Accessibility first**: ARIA labels, keyboard nav, focus rings on all interactive elements

### Testing

```bash
# Type checking
npx tsc --noEmit -p .

# Linting
npm run lint

# No automated tests yet (scaffolding in place for Phase 2+)
```

---

## 🎨 UI/UX Highlights

### Duolingo-Inspired Design

**Hearts System**: Lose a life for weak answers (score < 50%). Purely motivational—never blocks progress or changes what's sent to the server.

**Mascot Reactions**: Character animates based on answer quality:
- ✅ Strong answer → Celebrate + sparkles
- ❌ Weak answer → Confused shake
- ⏳ Pending evaluation → Thinking (breathing)

**Chunky Cards**: Bolder borders, stronger shadows, rounded corners. Feels tactile & present.

**3D Option Buttons**: `border-b-4` creates depth; tap-down animation with spring physics.

**No Per-Turn Feedback**: Feedback is deferred to SessionSummary (end of interview). Reduces second-guessing.

### Responsive Design

- **Desktop (≥1024px)**: Side-by-side Chat + Workspace
- **Tablet (768–1023px)**: Chat + Workspace columns with reduced padding
- **Mobile (<768px)**: Tab switcher between Chat & Workspace

---

## 📊 Metrics & Analytics (TBD)

Phase 1 includes scaffolding for:
- Session completion rate by specialty
- Average score distribution per level
- Knowledge gap frequency (most-repeated gaps)
- Guest-to-login conversion at paywall
- Mascot reaction timing (UX feedback signal)

Analytics dashboard coming in Phase 2.

---

## 🔐 Security & Privacy

**Current Phase 1**:
- Guest mode only (no auth, no personal data stored)
- Session data in `sessionStorage` (client-side only, not persisted server-side)
- Interview count in `localStorage` (just a number, no PII)

**Post-MVP**:
- User accounts with proper auth
- Server-side session persistence
- Privacy policy & data retention rules
- GDPR/CCPA compliance (legal review TBD)

---

## 🤝 Contributing

This is a private project. For contribution guidelines, contact the maintainers.

---

## 📝 License

Private. All rights reserved.

---

## 🙋 Support & Feedback

### Bugs & Issues
Report via this repo's issue tracker.

### Feature Requests
See [CHANGELOG.md](CHANGELOG.md) for roadmap. Phase 2+ features welcome as issues.

### Questions?
Check the docs in `docs/` and `specs/` directories. For architecture questions, start with [docs/hla.md](docs/hla.md).

---

## 📅 Roadmap

| Phase | Domains | Status |
|-------|---------|--------|
| **1** | Tech (6 specialties) | ✅ Complete |
| **2** | Web Dev | 📅 Planned |
| **3** | Cybersecurity, Mobile Dev | 📅 Planned |
| **4** | AI/ML, Blockchain | 📅 Planned |

See [CHANGELOG.md](CHANGELOG.md) for details.

---

## 🎓 Special Thanks

- Duolingo, for the UX inspiration
- Next.js team, for the modern web framework
- Shadcn/UI & Radix UI, for accessible components
- Our early beta users, for feedback

---

**Made with ❤️ by the Vibe Check team**  
Last updated: 2026-09-13
