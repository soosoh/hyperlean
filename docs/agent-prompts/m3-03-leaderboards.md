# Agent Prompt: M3.3 — Leaderboards (components/leaderboard/)

**Role:** Frontend engineer (React)  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-3-competitive.md (Sub-task 3.3), AGENTS.md

## Goal
Filterable global leaderboards: MMR, total theorems, daily activity.

## Files to create
- `components/leaderboard/Leaderboard.tsx`
- `components/leaderboard/LeaderboardRow.tsx`

## Requirements
- Filter tabs: MMR / total theorems / daily activity
- Sortable rows showing rank, username, mmr, theorems solved
- Data source: local store for now; structure ready for remote (Supabase) at M3
- Dark theme

## Conventions
- Follow AGENTS.md (`components/leaderboard/`)
- Named exports only

## Acceptance criteria
- `npx tsc --noEmit` passes
- Filtering/sorting works
- `npm run lint` clean

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`

## Done signal
Report: files created, tsc/lint result, filter/sort confirmed.
