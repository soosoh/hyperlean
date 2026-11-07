# Agent Prompt: M3.1 — MMR algorithm (lib/mmr.ts)

**Role:** TypeScript engineer  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-3-competitive.md (Sub-task 3.1), AGENTS.md

## Goal
Elo-style MMR adjustment for time-attack completions. Deterministic, zero-sum.

## Files to create
- `lib/mmr.ts`

## Requirements
Export `adjustMMR(playerMMR: number, opponentMMR: number, result: 'win' | 'loss' | 'draw', kFactor?: number)` → `{ newPlayerMMR: number; newOpponentMMR: number; change: number }`

Standard Elo: expected = 1 / (1 + 10^((opponent - player)/400)); change = k * (actual - expected); default kFactor = 32.

## Conventions
- Follow AGENTS.md (`lib/`)
- Pure function; no side effects
- Named exports only

## Acceptance criteria
- `npx tsc --noEmit` passes
- Deterministic (same input → same output)
- Zero-sum: player change = -opponent change

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`

## Done signal
Report: file created, tsc/lint result, zero-sum property verified.
