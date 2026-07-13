# Task 5 — Progressive 3D boundary and resilient fallback

## Status

Implemented and verified. Scope is limited to the progressive R3F boundary; the
Cosmic Station scene remains for Task 6.

## RED

Command:

```bash
npm run test:run -- src/experience
```

Result: failed as expected. Both suites could not resolve the not-yet-created
`./quality` and `./AdaptiveCanvas` modules. This established the test-first
baseline before production code existed.

## GREEN

Implemented:

- Exact `SceneSection`, `SceneState`, and `QualityProfile` contracts.
- Deterministic low/medium/high quality selection.
- Reduced motion always selects low quality.
- Memory-constrained mobile devices select low quality.
- WebGL capability check before R3F mounts.
- `forceFallback` test seam and presentational 2D fallback.
- Canvas render-error isolation through `ErrorBoundary`.
- Lazy `AdaptiveCanvas` integration after semantic homepage content.
- No React state updates or frame-loop hooks in the boundary.

Focused command:

```bash
npm run test:run -- src/experience
```

Result: 2 files passed, 7 tests passed.

## Full verification

```bash
npm run test:run
npm run typecheck
npm run lint
npm run build
```

Results:

- Tests: 10 files passed, 26 tests passed.
- Typecheck: passed (`tsc -b --pretty false`).
- Lint: passed with zero errors and zero warnings.
- Build: passed (`tsc -b && vite build`).

## Chunk evidence

Vite production output:

```text
dist/assets/index-CE1VfUeO.js           299.30 kB │ gzip:  95.06 kB
dist/assets/AdaptiveCanvas-zIzOl6LG.js  873.48 kB │ gzip: 232.34 kB
```

The Three/R3F boundary is isolated in the lazy `AdaptiveCanvas` chunk and does
not inflate the initial semantic application chunk.

## Commit

`feat: add resilient adaptive 3D experience boundary`

## Self-review and concerns

- Scope review: no station geometry, scroll observer, camera transition, assets,
  postprocessing implementation, or per-frame React state was introduced.
- Resilience review: forced fallback, missing WebGL, and render exceptions are
  covered by tests; semantic HTML remains independent of the canvas.
- Performance concern: the separate Three/R3F chunk is 873.48 kB minified
  (232.34 kB gzip), so Vite emits its >500 kB warning. The split protects initial
  content latency, but Task 6 should continue to gate secondary assets and avoid
  importing unused Drei/postprocessing modules.
- Capability selection intentionally uses stable device signals only. Missing
  `navigator.deviceMemory` defaults to the medium profile rather than risking a
  high profile on unknown hardware.
