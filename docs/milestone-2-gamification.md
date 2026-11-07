# Milestone 2: Gamification, Streaks & Progression

**Goal:** Embed psychological engagement loops (Duolingo-style mechanics).

**Prerequisites:** M1 signed off (types, graph, validator, editor, stores all working).

---

## Sub-task 2.1: Streak tracker (lib/streak.ts)

**Deliverables:** `lib/streak.ts`

**Logic:**
- Daily streak with local date validation (compare lastActiveDate to today)
- Increment on activity, reset on gap, freeze logic optional
- Milestone celebrations at 3, 7, 30 days

**Acceptance criteria:**
- Streak survives page reload (LocalStorage)
- Date validation uses local timezone date strings

---

## Sub-task 2.2: User profile store (store/user.ts)

**Deliverables:** `store/user.ts`

**Slice:** `username`, `mmr`, `rank` (Bronze/Silver/Gold/Diamond/Master), `streak`, `xp`, `unlockedAchievements`, `bookmarks`

**Persistence:** Zustand persist middleware (LocalStorage / IndexedDB)

---

## Sub-task 2.3: Gamification UI (components/gamification/)

**Deliverables:** `components/gamification/RankUpModal.tsx`, `components/gamification/XPBar.tsx`, `components/gamification/StatBadge.tsx`

**Requirements:**
- Animated rank-up modal (Framer Motion spring physics) on rank change
- XP progression bar
- Stat badge: "X% of users proved this" (local calc from solved count)
- Dark theme colors

**Acceptance criteria:**
- Rank-up modal triggers on rank change
- Animations smooth, respects `prefers-reduced-motion`

---

## Sub-task 2.4: Achievement system (SVG badges)

**Deliverables:** `components/gamification/AchievementBadge.tsx`, `data/achievements.ts`

**Requirements:**
- Unlockable SVG badges (First Proof, Streak 3, Streak 7, Speed Demon, etc.)
- XP progression tied to theorem difficulty

**Acceptance criteria:**
- Badges unlock and persist
- SVG renders inline (dark-mode friendly)

---

## Exit criteria (M2 sign-off)
- Streak persists across reloads
- Rank-up modal triggers correctly
- Achievements unlock and persist
- `tsc --noEmit`, ESLint, `next build` clean

**Human approval required before M3.**
