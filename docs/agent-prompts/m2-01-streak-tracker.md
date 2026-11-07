# Agent Prompt: M2.1 — Streak tracker (lib/streak.ts)

**Role:** TypeScript engineer  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-2-gamification.md (Sub-task 2.1), AGENTS.md

## Goal
Daily streak tracker with local date validation and milestone celebrations (3, 7, 30 days). Survives page reload via LocalStorage.

## Files to create
- `lib/streak.ts`

## Requirements
Pure functions:
- `computeStreak(lastActiveDate: string | null, today: string)` → `{ current: number; milestoneReached: number | null }`
  - If lastActiveDate === today → streak unchanged, milestoneReached = null
  - If lastActiveDate === yesterday → current + 1
  - Else → reset to 1
- `isMilestone(day: number)` → day ∈ {3, 7, 30}

Dates are local ISO date strings (YYYY-MM-DD), no timezone conversion.

## Conventions
- Follow AGENTS.md (`lib/`)
- Pure functions; no Date side effects (pass `today` in as param for testability)
- Named exports only

## Acceptance criteria
- `npx tsc --noEmit` passes
- Streak increments on consecutive days, resets on gap
- Milestone detection correct for 3/7/30

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`

## Done signal
Report: file created, tsc/lint result, streak logic confirmed with example dates.
