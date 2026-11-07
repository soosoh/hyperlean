# Agent Prompt: M5.1 — Global hotkey listener (hooks/useHotkeys.ts)

**Role:** Frontend engineer (React)  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-5-polish-a11y.md (Sub-task 5.1), AGENTS.md

## Goal
Global hotkey listener with visible focus rings. Bindings: J/K/Arrows, Enter, Ctrl/Cmd+Enter, Tab/Shift+Tab, /.

## Files to create
- `hooks/useHotkeys.ts`

## Requirements
- Custom hook `useHotkeys(bindings: Record<string, callback>, enabled?: boolean)`
- Registers keydown listener on window; cleans up on unmount
- Prevents default where appropriate (e.g., Ctrl+Enter)
- Works alongside Tab focus navigation (doesn't break it)

## Conventions
- Follow AGENTS.md (`hooks/`)
- Named exports only

## Acceptance criteria
- `npx tsc --noEmit` passes
- All five key groups trigger callbacks
- `npm run lint` clean

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`

## Done signal
Report: file created, tsc/lint result, each hotkey confirmed firing.
