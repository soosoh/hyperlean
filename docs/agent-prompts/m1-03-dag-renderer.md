# Agent Prompt: M1.3 — Skill tree DAG renderer (components/graph/)

**Role:** Frontend engineer (React + SVG/Canvas)  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-1-core-engine.md (Sub-task 1.3), AGENTS.md

## Goal
Render the skill tree DAG with zoom/pan, node status styling, and keyboard navigation. Dark theme.

## Files to create
- `components/graph/SkillTree.tsx`
- `components/graph/Node.tsx`
- `components/graph/Edge.tsx`

## Requirements
- Zoom/pan (SVG recommended; React SVG with transform, or a lightweight pan-zoom)
- Node status colors: Locked = gray, Available = #3B82F6 (primary), Completed = #10B981 (success)
- Background #0A0F1D, card surfaces #1E293B
- Keyboard nav: `J`/`K` or Arrow keys move focus between nodes; `Enter` inspects selected node
- Visible focus ring on focused node (keyboard-visible, not just hover)
- Dark mode primary per AGENTS.md theme

## Conventions
- Follow AGENTS.md (`components/graph/`)
- Import types from `@/types`, stores from `@/store`
- Framer Motion optional for node entrance animation
- No default exports

## Acceptance criteria
- Renders all theorems with correct status colors
- Keyboard focus moves between nodes with `J`/`K`/Arrows
- `Enter` on a node triggers inspection (console log or state change is acceptable for M1)
- `npx tsc --noEmit` passes
- `npm run lint` clean

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`
Run: `npm run dev` — visually confirm nodes render with status colors

## Done signal
Report: files created, tsc/lint result, keyboard nav confirmed working.
