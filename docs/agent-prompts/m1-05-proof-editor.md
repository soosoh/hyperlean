# Agent Prompt: M1.5 — Proof editor (components/proof/)

**Role:** Frontend engineer (React)  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-1-core-engine.md (Sub-task 1.5), AGENTS.md

## Goal
Implement the proof editor with line-by-line step input, syntax highlighting, step-by-step rule checking, and keyboard navigation. Dark theme.

## Files to create
- `components/proof/ProofEditor.tsx`
- `components/proof/StepLine.tsx`

## Requirements
- Line-by-line step input (each line = ProofStep formula + rule)
- Basic syntax highlighting (keywords: →, ∧, ∨, ¬, ↔, ∀, ∃; variables; parentheses)
- `Tab` / `Shift+Tab` moves focus across proof-editor lines with visible focus rings
- `Ctrl/Cmd + Enter` validates the current proof (calls validateStep per line)
- Step-by-step rule application checker: each line validated against context of prior lines
- Dark theme: bg #0A0F1D, card #1E293B, accent #3B82F6

## Conventions
- Follow AGENTS.md (`components/proof/`)
- Import validateStep from `@/lib/proof-validator`
- Import types from `@/types`
- Visible focus rings on focused line
- Named exports only

## Acceptance criteria
- All actions key-bindable (Tab/Shift+Tab/Ctrl+Enter)
- Visible focus rings
- Validation calls validator per line
- `npx tsc --noEmit` passes
- `npm run lint` clean

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`
Run: `npm run dev` — confirm editor renders and hotkeys work

## Done signal
Report: files created, tsc/lint result, keyboard nav + validation confirmed.
