# Agent Prompt: M1.6 — Hint throttling + proof store (lib/hints.ts, store/proof.ts)

**Role:** TypeScript / Zustand engineer  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-1-core-engine.md (Sub-task 1.6, 1.7), AGENTS.md

## Goal
Implement progressive hint throttling (max 3 hints per proof, cooldown timers) and the proof Zustand store with LocalStorage persistence.

## Files to create
- `lib/hints.ts`
- `store/proof.ts`

## Requirements
`lib/hints.ts`:
- `canUseHint(hintsUsed: number, cooldownUntil: number | null)` → boolean
- `nextHintState(hintsUsed: number)` → `{ hintsUsed: number; cooldownUntil: number }` (max 3; cooldown = Date.now() + e.g. 30s)

`store/proof.ts` (Zustand slice + persist):
- `currentProof: string[]`
- `hintsUsed: number`
- `cooldownUntil: number | null`
- `validationState: 'idle' | 'valid' | 'invalid' | 'validating'`
- actions: `addStep`, `setStep`, `useHint`, `setValidationState`, `resetProof`
- persist middleware (LocalStorage) for currentProof/hintsUsed/cooldownUntil

## Conventions
- Follow AGENTS.md (`lib/`, `store/`)
- Import from `@/store/persistence` if it exists, else configure persist inline
- Named exports only

## Acceptance criteria
- 4th hint blocked (hintsUsed capped at 3)
- Cooldown enforced between hints
- `npx tsc --noEmit` passes
- `npm run lint` clean

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`

## Done signal
Report: files created, tsc/lint result, hint cap and cooldown behavior confirmed.
