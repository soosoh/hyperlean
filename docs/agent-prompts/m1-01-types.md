# Agent Prompt: M1.1 — TypeScript types (theorems, axioms, steps)

**Role:** TypeScript engineer  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-1-core-engine.md (Sub-task 1.1), AGENTS.md

## Goal
Define TypeScript types for theorems, axioms, and proof step validation. Strict mode, no `any`.

## Files to create
- `types/theorem.ts`
- `types/axiom.ts`
- `types/step.ts`
- `types/index.ts`

## Requirements
`types/theorem.ts`:
- `NodeStatus` = `'Locked' | 'Available' | 'Completed'`
- `TheoremStat` = `{ solveCount: number; avgTimeSeconds: number }`
- `Theorem` = `{ id: string; title: string; category: string; description: string; difficulty: number; prerequisites: string[]; axioms: string[]; targetConclusion: string; solved?: boolean; firstProvedBy?: string; stats: TheoremStat }`
- `TheoremNode` = `Theorem & { status: NodeStatus }`

`types/axiom.ts`:
- `AxiomType` = `'propositional' | 'first-order'`
- `Axiom` = `{ id: string; name: string; type: AxiomType; schema: string; description: string }`

`types/step.ts`:
- `RuleType` = `'ModusPonens' | 'Substitution' | 'Axiom'`
- `ProofStep` = `{ id: string; formula: string; rule: RuleType; justification: string; lineNumber: number; dependsOn: string[] }`
- `ValidationResult` = `{ valid: boolean; reason?: string; inferredConclusion?: string }`

`types/index.ts`: barrel re-export all named exports from the three files.

## Conventions
- Follow AGENTS.md directory conventions (`types/`)
- TypeScript strict mode: explicit return types, no implicit any
- Export only named exports (no default exports)

## Acceptance criteria
- `npx tsc --noEmit` passes with zero errors
- All exports are typed; no `any`
- Importable via `@/types` path alias (check tsconfig paths)

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint` (once ESLint config exists)

## Done signal
Report: files created, tsc result, any type issues found.
