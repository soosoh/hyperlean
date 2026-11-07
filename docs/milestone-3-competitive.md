# Milestone 3: Competitive Engine & Leaderboards

**Goal:** Add speed-run modes, MMR ratings, and global rankings.

**Prerequisites:** M2 signed off.

**Backend decision:** Confirm client-only (LocalStorage) vs Supabase/PostgreSQL before starting.

---

## Sub-task 3.1: MMR algorithm (lib/mmr.ts)

**Deliverables:** `lib/mmr.ts`

**Logic:** Elo-style adjustment for time-attack completions. Export `adjustMMR(playerMMR, opponentMMR, result, kFactor)`.

**Acceptance criteria:**
- Deterministic
- Winner gains, loser loses; sum conserved (zero-sum)

---

## Sub-task 3.2: Speed-run timer (components/proof/SpeedRunTimer.tsx)

**Deliverables:** `components/proof/SpeedRunTimer.tsx`

**Requirements:** Live countdown, start/pause/reset, time-attack mode flag

---

## Sub-task 3.3: Leaderboards (components/leaderboard/)

**Deliverables:** `components/leaderboard/Leaderboard.tsx`, `components/leaderboard/LeaderboardRow.tsx`

**Filters:** MMR, total theorems, daily activity

**Acceptance criteria:**
- Filterable; remote or local data source

---

## Sub-task 3.4: Submission model (types/submission.ts + lib/storage.ts)

**Deliverables:** `types/submission.ts`, `lib/storage.ts`

Submission: `{ id, theoremId, userId, code, steps, characterCount, upvotes, createdAt }`

---

## Exit criteria (M3 sign-off)
- MMR adjusts after timed completion
- Leaderboard reflects data
- `tsc --noEmit`, ESLint, `next build` clean

**Human approval required before M4.**
