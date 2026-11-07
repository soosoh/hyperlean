# Agent Prompt: M2.2 — User profile store (store/user.ts)

**Role:** TypeScript / Zustand engineer  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-2-gamification.md (Sub-task 2.2), AGENTS.md

## Goal
User profile Zustand slice with persist middleware: username, mmr, rank, streak, xp, unlockedAchievements, bookmarks.

## Files to create
- `store/user.ts`

## Requirements
Slice state:
- `username: string`
- `mmr: number` (default 1200)
- `rank: 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Master'`
- `streak: { current: number; lastActiveDate: string | null }`
- `xp: number`
- `unlockedAchievements: string[]`
- `bookmarks: string[]`

Actions:
- `setUsername`, `setMMR`, `setRank`, `addXP`, `toggleBookmark(theoremId)`, `addAchievement(id)`, `updateStreak(current, lastActiveDate)`

Persist middleware: LocalStorage (or IndexedDB via zustand/middleware). Check `store/persistence.ts` if it exists.

## Conventions
- Follow AGENTS.md (`store/`)
- Import types from `@/types`
- Rank thresholds: Bronze <1200, Silver 1200-1500, Gold 1500-1800, Diamond 1800-2100, Master 2100+
- Named exports only

## Acceptance criteria
- `npx tsc --noEmit` passes
- Profile persists across reload
- Rank recomputes from MMR correctly

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`

## Done signal
Report: file created, tsc/lint result, persistence confirmed.
