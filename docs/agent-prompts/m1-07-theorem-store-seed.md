# Agent Prompt: M1.7 — Theorem store + seed data (store/theorem.ts, data/theorems.ts, data/axioms.ts)

**Role:** TypeScript engineer  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-1-core-engine.md (Sub-task 1.7, 1.8), AGENTS.md

## Goal
Wire the theorem Zustand store (solved IDs, available nodes) and seed the initial theorem/axiom catalog (~10 propositional/first-order theorems).

## Files to create
- `store/theorem.ts`
- `data/theorems.ts`
- `data/axioms.ts`

## Requirements
`store/theorem.ts` (Zustand + persist):
- `solvedIds: Set<string>`
- `setSolved(id: string)`
- `availableNodes(theorems: Theorem[])` → Theorem[] (uses getNodeStatus from @/lib/graph)
- persist solvedIds to LocalStorage

`data/theorems.ts`: array of ~10 Theorem objects
- Examples: Modus Ponens, Hypothetical Syllogism, De Morgan's, Contraposition, etc.
- Each with prerequisites, axioms, targetConclusion, difficulty, stats

`data/axioms.ts`: array of Axiom objects (propositional + first-order schemas)

Constraint: DAG must have no cycles.

## Conventions
- Follow AGENTS.md (`store/`, `data/`)
- Import graph functions from `@/lib/graph`
- Import types from `@/types`
- Named exports only

## Acceptance criteria
- `npx tsc --noEmit` passes
- DAG acyclic (buildDAG does not throw)
- Store persists solvedIds across reload
- `npm run lint` clean

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`

## Done signal
Report: files created, tsc/lint result, cycle check passed, theorem count.
