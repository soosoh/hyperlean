# Agent Prompt: M3.2 — Speed-run timer (components/proof/SpeedRunTimer.tsx)

**Role:** Frontend engineer (React)  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-3-competitive.md (Sub-task 3.2), AGENTS.md

## Goal
Live countdown timer for speed-run / time-attack proof mode.

## Files to create
- `components/proof/SpeedRunTimer.tsx`

## Requirements
- Start/pause/reset controls
- Live countdown display (MM:SS)
- time-attack mode flag; emits `onTimeUp` when expired
- Dark theme colors

## Conventions
- Follow AGENTS.md (`components/proof/`)
- Named exports only

## Acceptance criteria
- `npx tsc --noEmit` passes
- Timer counts down accurately; pause/resume works
- `npm run lint` clean

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`

## Done signal
Report: file created, tsc/lint result, timer behavior confirmed.
