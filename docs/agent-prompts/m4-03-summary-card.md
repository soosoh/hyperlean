# Agent Prompt: M4.3 — Summary card generator (lib/card-generator.ts, components/gamification/SummaryCard.tsx)

**Role:** Frontend engineer (Canvas + React)  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-4-social-export.md (Sub-task 4.3), AGENTS.md

## Goal
Canvas-to-image export for streaks and rank unlocks (Instagram/Twitter summary card).

## Files to create
- `lib/card-generator.ts`
- `components/gamification/SummaryCard.tsx`

## Requirements
- `generateCard(data: { streak; rank; xp; theoremsSolved })` → draws to offscreen canvas, returns PNG data URL
- SummaryCard: button to trigger download of the generated image
- Dark theme card design with Hyperlean branding colors

## Conventions
- Follow AGENTS.md (`lib/`, `components/gamification/`)
- Named exports only

## Acceptance criteria
- `npx tsc --noEmit` passes
- Canvas renders card; download produces valid PNG
- `npm run lint` clean

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`
Run: `npm run dev` — confirm image download works

## Done signal
Report: files created, tsc/lint result, PNG export confirmed.
