# Agent Prompt: M1.2 — DAG graph logic (lib/graph.ts)

**Role:** TypeScript engineer  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-1-core-engine.md (Sub-task 1.2), AGENTS.md, types/theorem.ts

## Goal
Build pure DAG logic: topological sort, node status computation, available-node retrieval. Cycle detection required.

## Files to create
- `lib/graph.ts`

## Requirements (pure functions, no side effects)
`buildDAG(theorems: Theorem[])` → `{ adjacency: Record<string, string[]>; topoOrder: string[] }`
- Topological order deterministic (stable sort by id as tiebreaker)
- Throw Error if cycle detected

`getNodeStatus(theorem: Theorem, solvedIds: Set<string>)` → `NodeStatus`
- Completed if theorem.id in solvedIds
- Available if all prerequisites in solvedIds (and not completed)
- Locked otherwise

`getAvailableNodes(theorems: Theorem[], solvedIds: Set<string>)` → `Theorem[]`
- Returns theorems with status `Available`, sorted by id

## Conventions
- Follow AGENTS.md (`lib/`)
- Import `Theorem`, `NodeStatus` from `@/types`
- No default exports; named exports only

## Acceptance criteria
- `npx tsc --noEmit` passes
- Topological sort is deterministic
- Cycle throws
- Status logic correct for all three states

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`

## Done signal
Report: file created, tsc result, cycle detection behavior confirmed.
