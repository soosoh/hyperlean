# Agent Prompt: M4.2 — Collections + Code Golf (components/gamification/)

**Role:** Frontend engineer (React)  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-4-social-export.md (Sub-task 4.2), AGENTS.md

## Goal
Theorem Collections (creatable/savable) and Code Golf leaderboards (sorted by character count and upvotes).

## Files to create
- `components/gamification/Collection.tsx`
- `components/gamification/CodeGolfLeaderboard.tsx`

## Requirements
- Collection: name, description, list of theorem IDs; save/load from LocalStorage
- CodeGolfLeaderboard: list of submissions sorted by character count (asc) and upvotes (desc)
- Dark theme

## Conventions
- Follow AGENTS.md (`components/gamification/`)
- Use `lib/storage.ts` for persistence
- Named exports only

## Acceptance criteria
- `npx tsc --noEmit` passes
- Collections creatable/savable
- Code Golf sorted correctly

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`

## Done signal
Report: files created, tsc/lint result, collection + sort confirmed.
