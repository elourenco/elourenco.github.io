# Task 6 — Cosmic Realism station and scroll-driven scene

## Status

Implemented and verified. The homepage keeps semantic HTML as the authoritative
content layer while a procedural, runtime-asset-free orbital station responds to
stable section anchors.

## RED

Command:

```bash
npm run test:run -- src/experience/useSectionObserver.test.tsx
```

Result: failed as expected because `./useSectionObserver` did not exist. This
established the test-first boundary before observer production code was added.

## GREEN

Implemented:

- Deterministic `IntersectionObserver` selection by largest ratio, with declared
  section order as the equal-ratio tie-breaker.
- Prior-section retention when no section intersects, thresholds
  `[0.25, 0.5, 0.7]`, and observer cleanup on unmount.
- Stable anchor mapping: `main-content -> arrival`, `work -> ai-core`,
  `expertise -> systems`, `career -> career`, and `contact -> contact`.
- Procedural station deck, physical AI core, two orbital rings, antenna modules,
  parabolic dishes, and deterministic instanced sparse stars. No model, texture,
  font, CDN, or remote runtime request is used by the experience source.
- Standard/physical metal, ceramic, glass, and restrained cyan emissive
  materials, plus a directional key, point fill, and hemisphere environment.
- Fixed camera positions and look targets for all five `SceneSection` values.
  Delta-time exponential damping mutates Three.js objects only; no React setter
  is called from `useFrame`.
- Reduced motion disables camera travel, orbital motion, stars, shadows,
  antialiasing, and bloom; the canvas uses `frameloop="demand"` and invalidates
  only on explicit section changes.
- Quality gates control shadow maps, star instance count, antialiasing, and a
  restrained `UnrealBloomPass`.
- Fixed presentational canvas layer with no pointer input. HTML, links, routing,
  accessibility, and the existing WebGL/error fallbacks remain independent.
- Explicit Rolldown code splitting isolates Three/R3F/postprocessing from both
  the initial semantic application and the small scene integration chunk.

Focused command:

```bash
npm run test:run -- src/experience
```

Result: 3 files passed, 10 tests passed.

## Full verification

```bash
npm run test:run
npm run typecheck
npm run lint
npm run build
```

Results:

- Tests: 11 files passed, 29 tests passed.
- Typecheck: passed (`tsc -b --pretty false`).
- Lint: passed with zero errors and zero warnings.
- Build: passed (`tsc -b && vite build`).
- Experience source scan found no HTTP URL, `useGLTF`, or React setter inside a
  frame callback.

## Chunk evidence

Final Vite production output:

```text
dist/assets/rolldown-runtime-QTnfLwEv.js    0.69 kB │ gzip:   0.42 kB
dist/assets/AdaptiveCanvas-CZcgY2hn.js      6.98 kB │ gzip:   2.59 kB
dist/assets/index-CBwd1gOO.js             288.24 kB │ gzip:  91.40 kB
dist/assets/three-vendor-BCGIBXBX.js      899.17 kB │ gzip: 239.74 kB
```

The initial application does not fetch the Three vendor chunk until the lazy
experience boundary is requested. Scene-owned code remains a separate 2.59 kB
gzip chunk.

## Self-review and concerns

- Scope review: only Task 6 experience, homepage integration, canvas-layer CSS,
  build chunking, observer tests, and this report are included. Existing user
  changes to `.gitignore`, `.superpowers/sdd/task-4-report.md`, and generated
  `dist/` are excluded from the commit.
- Performance: star matrices are deterministic and written once per quality
  count; frame callbacks mutate existing Three.js objects and clamp large
  deltas. Low quality performs no continuous rendering.
- Throughput/concurrency: no runtime network assets compete with HTML or the
  initial JavaScript. GPU load is bounded by fixed geometry and quality-profile
  instance counts.
- Resilience: WebGL capability and render failures still fall back without
  affecting semantic content. IntersectionObserver absence retains `arrival`.
- Concern: the isolated Three vendor chunk is 899.17 kB minified / 239.74 kB
  gzip and still triggers Vite's 500 kB warning. It is lazy and cache-stable, but
  future visual features should not add broad Drei imports or more postprocessing
  without a measured frame-time and transfer-budget review.
- Concern: automated tests validate observer and fallback behavior, but visual
  frame-time/FPS and cinematic composition still require browser/device profiling
  in the later performance-polish task.

## Commit

`feat: create Cosmic Realism station experience`
