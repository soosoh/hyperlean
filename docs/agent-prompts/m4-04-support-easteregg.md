# Agent Prompt: M4.4 — Support widget + console Easter egg

**Role:** Frontend engineer (React)  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-4-social-export.md (Sub-task 4.4), AGENTS.md

## Goal
"Buy Me a Coffee" support widget and developer console Easter egg (ASCII art / mini logic puzzle in console.log).

## Files to create
- `components/layout/BuyMeCoffee.tsx`
- Update `app/layout.tsx` to add console Easter egg

## Requirements
- BuyMeCoffee: simple button/link widget (no real payment integration for M4)
- Console Easter egg: on app load, `console.log` ASCII art + a mini logic puzzle (e.g., "Solve: A → B, A ⊢ ?")

## Conventions
- Follow AGENTS.md (`components/layout/`, `app/`)
- No secrets/logging of keys
- Named exports only

## Acceptance criteria
- `npx tsc --noEmit` passes
- Console Easter egg prints on load
- `npm run lint` clean

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`
Open browser dev console — confirm Easter egg prints

## Done signal
Report: files created, tsc/lint result, console output confirmed.
