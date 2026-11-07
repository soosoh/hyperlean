# Agent Prompt: M5.2 — Settings Tab (components/layout/SettingsTab.tsx)

**Role:** Frontend engineer (React)  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-5-polish-a11y.md (Sub-task 5.2), AGENTS.md

## Goal
Centralized Settings Tab: themes, custom hotkey bindings, sound effects toggle.

## Files to create
- `components/layout/SettingsTab.tsx`

## Requirements
- Theme toggle (dark default; structure for future themes)
- Custom hotkey binding UI (rebind keys)
- Sound effects toggle (on/off)
- Persists to LocalStorage via user store or dedicated settings store
- Dark theme: bg #0A0F1D, card #1E293B

## Conventions
- Follow AGENTS.md (`components/layout/`)
- Named exports only

## Acceptance criteria
- `npx tsc --noEmit` passes
- Settings persist across reload
- `npm run lint` clean

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`

## Done signal
Report: file created, tsc/lint result, persistence confirmed.
