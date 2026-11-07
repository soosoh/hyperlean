# Milestone 4: Social, Curation & Export Layer

**Goal:** Enable community sharing, social profiles, and exports.

**Prerequisites:** M3 signed off.

---

## Sub-task 4.1: Contribution heatmap (components/gamification/Heatmap.tsx)

**Deliverables:** `components/gamification/Heatmap.tsx`

GitHub-style contribution heatmap for proof activity (LocalStorage-backed activity dates).

---

## Sub-task 4.2: Theorem Collections + Code Golf (components/gamification/)

**Deliverables:** `components/gamification/Collection.tsx`, `components/gamification/CodeGolfLeaderboard.tsx`

Collections creatable/savable. Code Golf sorted by character count and upvotes.

---

## Sub-task 4.3: Summary card generator (Canvas-to-image)

**Deliverables:** `lib/card-generator.ts`, `components/gamification/SummaryCard.tsx`

Canvas-to-image export for streaks and rare rank unlocks (Instagram/Twitter summary card).

---

## Sub-task 4.4: Support widget + console Easter egg

**Deliverables:** `components/layout/BuyMeCoffee.tsx`, `app/layout.tsx` (console.log Easter egg)

"Buy Me a Coffee" widget; developer console Easter egg (ASCII art / mini logic puzzle).

---

## Exit criteria (M4 sign-off)
- Shareable image exports render correctly
- Collections creatable/savable
- Console Easter egg present
- `tsc --noEmit`, ESLint, `next build` clean

**Human approval required before M5.**
