# Agent Prompt: M4.1 — Contribution heatmap (components/gamification/Heatmap.tsx)

**Role:** Frontend engineer (React + SVG)  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-4-social-export.md (Sub-task 4.1), AGENTS.md

## Goal
GitHub-style contribution heatmap for proof activity (LocalStorage-backed activity dates).

## Files to create
- `components/gamification/Heatmap.tsx`

## Requirements
- Grid of colored squares for past year (like GitHub contributions)
- Color intensity by activity count (dark theme variants)
- Tooltip on hover showing date + count
- Dark theme colors

## Conventions
- Follow AGENTS.md (`components/gamification/`)
- Inline SVG
- Named exports only

## Acceptance criteria
- `npx tsc --noEmit` passes
- Heatmap renders with activity-based coloring
- `npm run lint` clean

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`

## Done signal
Report: file created, tsc/lint result.
