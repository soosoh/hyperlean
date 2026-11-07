# Milestone 1: Core Engine & Proof Validator

**Goal:** Build the interactive skill tree graph and the deterministic proof validation engine.

**Order of execution:** Types → Graph lib → DAG renderer → Proof validator → Proof editor → Hint throttling → Stores → Seed data.

---

## Sub-task 1.1: TypeScript types (theorems, axioms, steps)

**Owner:** execution-agent  
**Deliverables:** `types/theorem.ts`, `types/axiom.ts`, `types/step.ts`, `types/index.ts`

**Files to create:**

`types/theorem.ts` — export `Theorem`, `TheoremNode`, `NodeStatus` union (`Locked` | `Available` | `Completed`)

`types/axiom.ts` — export `Axiom`, `AxiomType` (propositional / first-order)

`types/step.ts` — export `ProofStep`, `RuleType` (`ModusPonens` | `Substitution` | `Axiom`), `ValidationResult`

`types/index.ts` — barrel re-export all

**Acceptance criteria:**
- `tsc --noEmit` passes
- Strict mode: no `any`, explicit types on all exports

**Theme:** none (types only)

---

## Sub-task 1.2: DAG graph logic (lib/graph.ts)

**Owner:** execution-agent  
**Deliverables:** `lib/graph.ts`

**Functions to implement:**
- `buildDAG(theorems: Theorem[])` → adjacency + topological order
- `getNodeStatus(theorem, solvedIds)` → `Locked` | `Available` | `Completed`
- `getAvailableNodes(theorems, solvedIds)` → Theorem[]

**Rules:** A node is `Available` only if all prerequisites are `Completed`. Cycle detection required (throw on cycle).

**Acceptance criteria:**
- Deterministic topological sort
- `tsc --noEmit` passes
- Pure functions, no side effects

---

## Sub-task 1.3: Skill tree DAG renderer (components/graph/)

**Owner:** execution-agent  
**Deliverables:** `components/graph/SkillTree.tsx`, `components/graph/Node.tsx`, `components/graph/Edge.tsx`

**Requirements:**
- Zoom/pan (SVG or Canvas)
- Node status styling: Locked (gray), Available (blue accent #3B82F6), Completed (green #10B981)
- Keyboard nav: `J`/`K` or Arrows to move focus; `Enter` to inspect
- Visible focus rings on focused node
- Dark theme: bg #0A0F1D, card #1E293B

**Acceptance criteria:**
- Renders all theorems with correct status colors
- Keyboard focus moves between nodes
- `tsc --noEmit` passes; ESLint clean

---

## Sub-task 1.4: Proof validator (lib/proof-validator.ts)

**Owner:** execution-agent  
**Deliverables:** `lib/proof-validator.ts`

**Rules to implement (deterministic, client-side):**
- Modus Ponens: from `A → B` and `A`, infer `B`
- Substitution: replace variables uniformly
- Axiom application: match step against axiom schema

**Export:** `validateStep(step, context, axioms)` → `ValidationResult` (valid/invalid + reason)

**Acceptance criteria:**
- Deterministic output for identical input
- No external deps (pure TypeScript)
- `tsc --noEmit` passes

---

## Sub-task 1.5: Proof editor (components/proof/)

**Owner:** execution-agent  
**Deliverables:** `components/proof/ProofEditor.tsx`, `components/proof/StepLine.tsx`

**Requirements:**
- Line-by-line step input
- Syntax highlighting (basic: keywords, variables, arrows)
- `Tab`/`Shift+Tab` focus-ring navigation across lines
- `Ctrl/Cmd + Enter` to validate current proof
- Step-by-step rule application checker calls `validateStep`

**Acceptance criteria:**
- All actions key-bindable
- Visible focus rings
- `tsc --noEmit` passes

---

## Sub-task 1.6: Hint throttling (lib/hints.ts + store/proof.ts)

**Owner:** execution-agent  
**Deliverables:** `lib/hints.ts`, `store/proof.ts`

**Logic:**
- Max 3 hints per proof
- Cooldown timer between hints
- Persist hint count in proof slice

**Acceptance criteria:**
- 4th hint blocked
- Cooldown enforced

---

## Sub-task 1.7: Zustand stores (store/theorem.ts, store/proof.ts)

**Owner:** execution-agent  
**Deliverables:** `store/theorem.ts`, `store/proof.ts`

- `theorem.ts`: `solvedIds: Set<string>`, `setSolved(id)`, `availableNodes()`
- `proof.ts`: `currentProof: string[]`, `hintsUsed`, `cooldownUntil`, validation state

**Acceptance criteria:**
- Persistence middleware wired (LocalStorage)
- `tsc --noEmit` passes

---

## Sub-task 1.8: Seed theorem & axiom data (data/theorems.ts, data/axioms.ts)

**Owner:** execution-agent  
**Deliverables:** `data/theorems.ts`, `data/axioms.ts`

**Content:** Initial catalog of ~10 propositional/first-order theorems (e.g., Modus Ponens, Hypothetical Syllogism, De Morgan's, Contraposition) with prerequisites, axioms, target conclusion.

**Acceptance criteria:**
- Data compiles with types
- DAG has no cycles

---

## Exit criteria (M1 sign-off)
- `tsc --noEmit` clean
- ESLint clean
- `next build` succeeds
- Proof validation deterministic; skill tree renders correct node states
- All actions key-bindable with visible focus rings

**Human approval required before M2.**
