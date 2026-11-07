# Agent Prompt: M2.3 — Gamification UI (RankUpModal, XPBar, StatBadge)

**Role:** Frontend engineer (React + Framer Motion)  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-2-gamification.md (Sub-task 2.3), AGENTS.md

## Goal
Animated rank-up modal, XP progression bar, and stat badges ("X% of users proved this"). Dark theme, Framer Motion spring physics.

## Files to create
- `components/gamification/RankUpModal.tsx`
- `components/gamification/XPBar.tsx`
- `components/gamification/StatBadge.tsx`

## Requirements
- RankUpModal: triggers on rank change; spring animation; shows old→new rank; respects `prefers-reduced-motion`
- XPBar: fill proportional to xp toward next rank threshold
- StatBadge: displays "X% of users proved this theorem" (local stat calc)
- Colors: bg #0A0F1D, card #1E293B, accent #3B82F6, success #10B981

## Conventions
- Follow AGENTS.md (`components/gamification/`)
- Framer Motion for animations
- Named exports only

## Acceptance criteria
- `npx tsc --noEmit` passes
- Rank-up modal animates on rank change
- `npm run lint` clean

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`
Run: `npm run dev` — confirm animations render

## Done signal
Report: files created, tsc/lint result, animations confirmed.
