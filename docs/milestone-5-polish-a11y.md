# Milestone 5: UI/UX Polish, Accessibility & Keyboard Nav

**Goal:** 100% keyboard accessibility, responsive mobile layouts, zero console errors.

**Prerequisites:** M4 signed off.

---

## Sub-task 5.1: Global hotkey listener (hooks/useHotkeys.ts)

**Deliverables:** `hooks/useHotkeys.ts`

Bindings: `J`/`K`/Arrows, `Enter`, `Ctrl/Cmd + Enter`, `Tab`/`Shift+Tab`, `/`. Visible focus rings required.

---

## Sub-task 5.2: Settings Tab (components/layout/SettingsTab.tsx)

**Deliverables:** `components/layout/SettingsTab.tsx`

Themes, custom hotkey bindings, sound effects toggle.

---

## Sub-task 5.3: Responsiveness + a11y audit

**Deliverables:** Mobile-responsive layouts; ARIA labels; keyboard traversal; contrast check.

**Exit criteria:**
- All actions key-bindable
- Lighthouse perf/a11y/best-practices ≥ 95
- Zero console errors
- `tsc --noEmit`, ESLint, `next build` clean

**M5 complete = project launch-ready.**
