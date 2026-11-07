# Agent Prompt: M3.4 — Submission model (types/submission.ts, lib/storage.ts)

**Role:** TypeScript engineer  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-3-competitive.md (Sub-task 3.4), AGENTS.md

## Goal
Submission type and storage layer for proof submissions (character count, upvotes, timestamps).

## Files to create
- `types/submission.ts`
- `lib/storage.ts`

## Requirements
`types/submission.ts`:
- `Submission` = `{ id: string; theoremId: string; userId: string; code: string; steps: string[]; characterCount: number; upvotes: number; createdAt: string }`

`lib/storage.ts`:
- LocalStorage wrapper: `getItem(key)`, `setItem(key, value)`, `removeItem(key)` with JSON serialize/deserialize and error handling

## Conventions
- Follow AGENTS.md (`types/`, `lib/`)
- Named exports only

## Acceptance criteria
- `npx tsc --noEmit` passes
- Storage wrapper gracefully handles missing/invalid data

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`

## Done signal
Report: files created, tsc/lint result.
