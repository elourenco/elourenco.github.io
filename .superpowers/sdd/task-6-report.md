# Task 6 — Responsive geometry, typography, and menu behavior

## Status

Implemented from baseline `551b08b`. The desktop rail now begins at 1180 px,
768–1179 px uses the compact sticky header, and widths below 768 px use the
stacked mobile layout. The change is CSS-only at runtime and adds no listeners,
state, or dependencies.

## Scope

Changed only the Task 6 owners:

- `scripts/design-system-css.test.mjs`
- `src/styles/base.css`
- `src/styles/layout.css`
- `src/styles/components.css`
- `e2e/portfolio.spec.ts`
- `.superpowers/sdd/task-6-report.md`

No copy, route, destination, SEO, locale, hero/particle runtime, or semantic
section markup changed.

## RED evidence

CSS boundary command:

```bash
node --test scripts/design-system-css.test.mjs
```

Result: 2 passed, 2 failed. The failures were exactly the absent 1179/767 media
boundaries and the unbounded section-title/metric typography contract.

Responsive E2E command:

```bash
npm run e2e -- --grep "responsive|reference viewport|compact header"
```

The first attempt was blocked before test execution by sandbox `EPERM` while
binding `127.0.0.1:4188`. The permitted rerun executed the suite and produced
7 failures, 22 passes, and 1 expected skip:

- overflow at 390, 768, 1024, 1440, and 1488 px in desktop Chromium;
- desktop rail still visible at 1024 px in both Playwright projects;
- mobile menu visibility and Escape focus restoration already passed.

Playwright diagnostics at 1488 px measured `scrollWidth=1540` for a
`viewportWidth=1488`. The only out-of-bounds nodes were the particle host and
fallback (`left=1020`, `right=1540`), tracing the overflow to the visual host
not clipping the intentional `right: -12%` dissolve field.

A final repeated run also exposed a font-load race at 390 px: after the display
font became active, `.home-hero__content` retained its grid-item
`min-width:auto` and expanded the page to 394 px. The E2E now waits for
`document.fonts.ready`, and the content grid item explicitly uses `min-width: 0`.

## Implementation

- Replaced the 800/1100 px breakpoint system with exact 1179/767 px boundaries.
- Kept desktop rail geometry as the default and scoped `white-space: nowrap` to
  rail labels only.
- Converted the header to a full-width sticky compact shell through 1179 px;
  the mobile panel can wrap long labels and keeps 44 px controls.
- At 768–1179 px, the hero remains two columns with both tracks bounded at
  `21rem`; the project card uses smaller compact-only minimum tracks.
- Below 768 px, hero, project card, expertise, contact, and Dona detail grids
  stack to one column; the capability strip uses two bounded columns.
- Added `overflow: clip` to `.home-hero__visual`, fixing the actual particle
  boundary instead of hiding overflow globally.
- Removed the hero content grid item's intrinsic minimum so the loaded display
  font cannot expand the 390 px layout.
- Set section titles to `clamp(2.5rem, 4vw, 4.25rem)`, Dona detail title to
  `clamp(4rem, 9vw, 8rem)`, and bounded its metric separately.
- Removed the viewport-driven `72svh` minimum from the Dona case hero. Existing
  content-sized expertise, career, and contact sections remain viewport-free.

## GREEN evidence

Required gates, run fresh after implementation:

```text
node --test scripts/design-system-css.test.mjs
4 passed, 0 failed

npm run e2e -- --grep "responsive|reference viewport|compact header"
29 passed, 1 skipped, 0 failed (4.8s)

npm run test:run
22 Vitest files passed, 55 tests passed
13 Node script tests passed
```

The Playwright gate verifies no horizontal overflow at 390, 768, 1024, 1440,
and 1488 px in both configured projects. At 1488 x 1058 it verifies the project
starts above the fold, portrait `x > 700`, and rail width `<= 132`. At 1024 it
verifies compact-header/hidden-rail behavior. At 390 it verifies all five menu
links are visible and Escape closes the panel with focus returned to the toggle.

Additional evidence:

```text
npm run build       passed; production chunks generated
npm run lint        passed
npm run typecheck   passed
git diff --check    passed
targeted Prettier   passed for every Task 6 source/test file
```

The single E2E skip is expected: WebGL context loss only runs in the eligible
desktop project. No WebGL test failed.

## Performance, concurrency, and resilience

- Runtime cost is CSS-only; there are no new resize, scroll, key, or animation
  listeners and no React work per frame.
- The particle canvas/fallback remains one progressive boundary; clipping is
  applied at its existing visual owner and does not add paint layers elsewhere.
- Responsive layout uses deterministic media queries and bounded grid tracks,
  so concurrent asset decode or delayed WebGL startup cannot change shell
  ownership or menu availability.
- The existing disclosure state owns Escape handling and focus restoration;
  E2E verifies the complete keyboard close path.
- Long navigation labels wrap only in the compact/mobile panel, preventing a
  localization-driven horizontal overflow while desktop rail labels stay stable.

## Concerns

- The Codex Browser plugin had no available backend in this session
  (`agent.browsers.list() = []`), so rendered verification used the repository's
  required Playwright workflow.
- Global `npm run format:check` still reports the preexisting, unchanged
  `src/experience/webgl-context-loss.ts`. Every Task 6 source/test file passes
  targeted Prettier, and the out-of-scope WebGL module was intentionally not
  modified.
- Full pixel-level comparison with the approved 1488 x 1058 image remains Task
  7; Task 6 closes the structural geometry and responsive contracts only.

## Commit

`fix: lock portfolio responsive geometry`
