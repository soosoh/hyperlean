# Agent Prompt: M1.4 — Proof validator (lib/proof-validator.ts)

**Role:** TypeScript / logic engineer  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-1-core-engine.md (Sub-task 1.4), AGENTS.md

## Goal
Implement deterministic client-side proof validation: Modus Ponens, Substitution, Axiom application. Pure TypeScript, no external deps.

## Files to create
- `lib/proof-validator.ts`

## Requirements
Export `validateStep(step: ProofStep, context: string[], axioms: Axiom[]): ValidationResult`

Rules:
- Modus Ponens: from `A → B` and `A` in context, infer `B`
- Substitution: uniform variable replacement; resulting formula must match target
- Axiom application: step formula matches an axiom schema (simple pattern/substitution match)

ValidationResult = `{ valid: boolean; reason?: string; inferredConclusion?: string }`

Must be deterministic: identical inputs → identical output every time.

## Conventions
- Follow AGENTS.md (`lib/`)
- Import types from `@/types`
- Pure functions; no Math.random, Date, or side effects
- Named exports only

## Acceptance criteria
- `pnpm run typecheck` passes
- Deterministic output verified (run same input 3×, same result)
- Each rule correctly accepts valid steps and rejects invalid ones with a reason

## Verification
Run: `pnpm run typecheck`
Run: `pnpm run lint`
Optionally write a quick sanity check script (not committed)

## Done signal
Report: file created, tsc result, determinism check result, example valid/invalid cases tested.
