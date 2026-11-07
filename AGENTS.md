# Hyperlean — AGENTS.md

Greenfield Next.js 15 + TypeScript project. Repo is currently empty; this file establishes working conventions. Update it as config/files are added.

## Stack (verified from architecture plan)
- Framework: Next.js 15 App Router, TypeScript strict mode
- Styling: Tailwind CSS v4
- UI primitives: Radix UI + Lucide React icons
- Animations: Framer Motion
- State: Zustand (persist middleware: LocalStorage / IndexedDB)
- Proof engine: pure TypeScript AST matcher (Modus Ponens, Substitution, Axiom application)
- No backend yet — client-only for Milestones 1–2; Supabase/PostgreSQL planned at Milestone 3 for MMR/leaderboards

## Directory conventions
```
app/            # Next.js App Router routes + layout.tsx + page.tsx
components/     # ui/ (Radix primitives), proof/, graph/, gamification/, layout/
lib/            # proof-validator.ts, graph.ts, mmr.ts, streak.ts, storage.ts
store/          # Zustand slices: user.ts, theorem.ts, proof.ts, persistence.ts
types/          # theorem.ts, user.ts, submission.ts, index.ts
hooks/          # useHotkeys.ts, useProof.ts, useStreak.ts
data/           # theorems.ts (seed catalog), axioms.ts
docs/           # one Markdown spec per milestone
```

## Execution flow (5 sequential milestones)
M1 Core Engine & Proof Validator → M2 Gamification/Streaks → M3 Competitive/Leaderboards → M4 Social/Export → M5 Polish/A11y

Do not start M(n+1) until M(n) has explicit sign-off: completed deliverables summarized, trade-offs noted, human approval given.

## Keyboard-first paradigm (must hold across all milestones)
- `J`/`K` or Arrows: navigate skill-tree nodes
- `Enter`: select/inspect node or submit proof
- `Ctrl/Cmd + Enter`: validate proof
- `Tab` / `Shift+Tab`: focus-ring navigation across proof-editor lines
- `/`: quick search theorems
Every action must be key-bindable; visible focus rings required.

## Visual theme (dark mode primary)
- Background: #0A0F1D
- Card surfaces: #1E293B
- Primary accent: #3B82F6
- Success: #10B981
- Error: #EF4444

## Decided
- Package manager: pnpm
- Deploy target: Vercel
- Auth/backend: client-only for M1–M2; Supabase/PostgreSQL at M3
- Theorem seed catalog: not yet defined

## Gotchas
- Do not commit secrets/keys; never log them.
- Run `tsc --noEmit`, ESLint, and `next build` before considering a milestone complete.
- Lighthouse targets: perf / a11y / best practices ≥ 95.
- Proof validation must be deterministic and client-side for M1.

## References
- Master orchestration prompt: Parts 1–4 (architecture, schemas, milestones, deployment, communication protocol)
- No existing README, CI config, or instruction files (CLAUDE.md, .cursorrules, opencode.json) present yet.
