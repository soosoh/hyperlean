# Agent Prompt: M5.3 — Responsiveness + a11y audit

**Role:** Frontend / a11y engineer  
**Repo:** C:\Users\hangy\OneDrive\Desktop\Projects\hyperlean  
**Reference:** docs/milestone-5-polish-a11y.md (Sub-task 5.3), AGENTS.md

## Goal
Mobile-responsive layouts, ARIA labels, keyboard traversal, contrast check. Zero console errors. Lighthouse ≥ 95 perf/a11y/best-practices.

## Files to modify (existing)
- `app/layout.tsx`, `app/page.tsx` (ensure responsive, semantic HTML)
- All `components/**` (add ARIA labels, focus rings, responsive classes)

## Requirements
- All components mobile-responsive (Tailwind sm/md/lg breakpoints)
- ARIA labels on interactive elements
- Visible focus rings on all keyboard-focusable elements
- Keyboard traversal: Tab moves logically through page
- Contrast: text on #0A0F1D / #1E293B meets WCAG AA (≥4.5:1)
- Zero console errors in dev and build
- `npx tsc --noEmit` clean
- `npm run lint` clean
- `npm run build` succeeds

## Conventions
- Follow AGENTS.md theme colors
- Tailwind v4
- No default exports

## Acceptance criteria
- Production build succeeds
- Lighthouse perf/a11y/best-practices ≥ 95 (run locally if Lighthouse available)
- Zero console errors

## Verification
Run: `npx tsc --noEmit`
Run: `npm run lint`
Run: `npm run build`
Run Lighthouse (if available) and report scores

## Done signal
Report: build result, lint result, Lighthouse scores, any a11y issues found and fixed.
