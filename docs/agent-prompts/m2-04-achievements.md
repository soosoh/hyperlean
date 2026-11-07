# Agent Prompt: M2.4 — Achievement system (SVG badges)

**Role:** Frontend engineer (SVG + React)  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-2-gamification.md (Sub-task 2.4), AGENTS.md

## Goal
Unlockable SVG badges tied to achievements (First Proof, Streak 3, Streak 7, Speed Demon, etc.). Dark-mode friendly inline SVGs.

## Files to create
- `components/gamification/AchievementBadge.tsx`
- `data/achievements.ts`

## Requirements
`data/achievements.ts`: array of `{ id: string; name: string; description: string; icon: React.ComponentType; unlockCondition: (user) => boolean }`
Examples: First Proof, Streak 3, Streak 7, Speed Demon (prove under time), etc.

`AchievementBadge.tsx`: renders inline SVG badge; locked = grayed out, unlocked = full color (#3B82F6/#10B981)

## Conventions
- Follow AGENTS.md (`components/gamification/`, `data/`)
- Inline SVG (not external image files)
- Named exports only

## Acceptance criteria
- `npx tsc --noEmit` passes
- Badges unlock and persist via user store
- SVG renders in dark theme

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`

## Done signal
Report: files created, tsc/lint result, achievement count, unlock flow confirmed.
