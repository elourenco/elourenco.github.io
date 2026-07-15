# Task 5 — Compact remaining sections and add one-shot reveals

## Status

Implemented and verified on base `b159d22`. Scope is limited to the reveal hook,
FeaturedProject, expertise, career, contact, and their CSS. Navigation, hero,
particles, global breakpoints, E2E, and final visual QA were not changed.

## RED evidence

### Reveal hook

```bash
npm test -- src/components/useRevealOnView.test.tsx
```

Failed as expected because `./useRevealOnView` did not exist.

### Featured project

```bash
npm test -- src/features/home/HomePage.test.tsx
```

Failed as expected because `#work` did not contain `.feature-card`. The run also
exposed a stale `EL-01` assertion left after Task 3 removed that ornament; the
assertion was corrected without modifying the hero.

## GREEN implementation

- Added `useRevealOnView<T>()` with one observer per section, one-shot reveal,
  idempotent disconnect, and no scroll listener or frame-driven React state.
- Reduced motion, missing `IntersectionObserver`, and missing target elements
  reveal content immediately.
- Kept the four semantic `section` roots and attached typed refs plus
  `data-revealed`; no heading relationship or wrapper hierarchy changed.
- Rebuilt FeaturedProject as one card with exactly one localized `h2`, preserved
  internal locale route, and used `donaCase.metric` for the compact metric.
- Added the real dashboard WebP with intrinsic `1120 x 700` dimensions,
  decorative semantics, and lazy loading to reserve layout space and avoid CLS.
- Compacted expertise cards, timeline rhythm, contact geometry, and the project
  layout. Reveal transitions use only opacity and translateY; reduced-motion CSS
  forces the final state with transitions disabled.

Focused GREEN command:

```bash
npm test -- src/components/useRevealOnView.test.tsx src/features/home/HomePage.test.tsx
```

Result: 2 files passed, 5 tests passed.

## Verification evidence

```bash
npm run typecheck
npm run build
```

Results:

- Typecheck: passed (`tsc -b --pretty false`).
- Build: passed (`tsc -b && vite build`).
- Dashboard output: `dist/assets/dona-events-dashboard-JgUJpnrW.webp`, 33.84 kB.
- Progressive chunks remain separate: `ParticleScene` 3.16 kB and
  `three-vendor` 883.51 kB.

## Commits

- `53c850c feat: refine portfolio sections and motion`

## Self-review and concerns

- Responsive `.feature-card` stacking remains intentionally deferred to Task 6;
  no global breakpoint or E2E contract was changed in this task.
- Vite still warns about the pre-existing 883.51 kB minified Three vendor chunk.
  This task did not add code to that chunk; the semantic app and dashboard remain
  independent of WebGL failure.
- Build and tests resolve the dashboard import. Final viewport comparison and
  interaction QA remain Task 7 responsibilities.
