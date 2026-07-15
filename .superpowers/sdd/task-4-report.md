# Task 4 report — Portrait dissolve field

## Status

Implemented on base `050e519`. The portrait now blends into a deterministic,
right-biased particle field with sparse connection segments. Points and lines
share the existing lazy Three.js scene and its single canvas.

Implementation commit: `f6352af feat: integrate the portrait dissolve field`.

## Files

- Modified `src/experience/particles/particle-layout.ts`
- Modified `src/experience/particles/particle-layout.test.ts`
- Modified `src/experience/particles/NeuralParticleField.tsx`
- Modified `src/experience/particles/particle-shaders.ts`
- Modified `src/experience/particles/particle-shaders.test.ts`
- Modified `src/styles/components.css`
- Modified `e2e/portfolio.spec.ts`

No hero copy, CTA destinations, capability content, section layout, global
responsive rules, dependencies, or routing were changed.

## TDD evidence

### RED — particle layout

Command:

```text
npm test -- src/experience/particles/particle-layout.test.ts
```

Result: exit 1; 1 file failed and 3 tests failed for the intended reasons:
`connections` was missing, determinism could not inspect it, and the empty
layout did not expose an empty connection buffer.

### RED — shader motion and opacity

Command:

```text
npm test -- src/experience/particles/particle-shaders.test.ts
```

Result: exit 1; 2 of 4 tests failed because production still used drift rates
`0.35` / `0.12` and fragment alpha multiplier `0.88`.

### GREEN — focused unit and component contracts

Final command:

```text
npm test -- src/experience/particles/particle-layout.test.ts src/experience/particles/particle-shaders.test.ts src/experience/ParticleExperience.test.tsx
```

Result: exit 0; 3 files passed and 8 tests passed. Coverage proves deterministic
buffers, at least 70% positive X positions, connection tuples divisible by six,
empty-buffer behavior, slow independent shader drift, circular point falloff,
softened alpha, and preservation of the existing particle host contract.

The pre-existing size assertion was aligned from `0.6` to the approved layout
contract minimum of `0.55`.

## E2E evidence

Final command:

```text
npm run e2e -- --grep "particle|WebGL|canvas"
```

Result: exit 0; 22 tests passed across desktop Chromium and mobile Chromium in
4.9 seconds. The focused browser coverage verifies:

- reduced motion leaves the semantic hero available without a canvas;
- Save-Data and mobile low-memory gates keep the portrait, navigation, and CTA
  available after the 1.2 second idle-gate window;
- unavailable WebGL keeps portrait, navigation, and primary CTAs visible;
- `webglcontextlost` removes the canvas while preserving heading, portrait,
  navigation, and CTAs;
- the active experience mounts zero or one canvas, never more;
- semantic content below the hero remains interactive.

The first sandboxed E2E attempt could not bind `127.0.0.1:4188` (`EPERM`). The
same project script was rerun with the required local-server permission and
passed. Playwright stopped its `webServer`; `lsof` found no listener remaining
on port 4188.

## Performance, concurrency, and throughput

- Layout generation remains deterministic and runs once per quality-profile
  particle count through `useMemo`.
- Connection search examines at most the preceding 12 particles for each sixth
  particle, so construction is bounded linear work rather than an all-pairs
  `O(n²)` scan.
- At the 9,000-particle desktop ceiling, the connection buffer has at most
  1,499 segments / 8,994 floats (about 36 KiB). Total point, phase, size, and
  maximum connection buffers remain about 211 KiB before Three.js overhead.
- Connections add one draw call inside the existing scene. There is still one
  `<Canvas>`, one React Three Fiber `useFrame`, no added
  `requestAnimationFrame`, and no React state update per frame.
- Three.js remains behind the existing async `LazyParticleScene` boundary; this
  task did not move it into the synchronous bundle.

## Resilience and interaction isolation

- The particle host remains `pointer-events: none`, so the higher visual
  `z-index` cannot intercept CTA or navigation input.
- The existing quality gate still rejects unavailable WebGL, reduced motion,
  Save-Data, and constrained mobile memory before loading the scene.
- Context loss still transitions through the existing React event boundary;
  the animation loop itself does not update React state.
- The portrait is HTML-first and outside the particle canvas. Complementary
  standard and WebKit masks blend its right edge with the canvas while keeping
  the fallback portrait markup independent of WebGL.

## Review and concerns

- `git diff --check` passed before the implementation commit.
- Source inspection found exactly one `<Canvas>` owner and exactly one
  `useFrame` call under `src/experience`; no second RAF was introduced.
- Connection segments intentionally remain static while points drift by a small
  shader-only amplitude. Updating line positions per frame would add CPU/GPU
  synchronization and another mutation path for negligible visual benefit.
- Full cross-browser visual comparison against the 1488 x 1058 reference is not
  claimed here; that remains the explicitly assigned Task 7 QA boundary.
- No full unit suite, global responsive QA, or production build was run because
  this worker was restricted to the Task 4 focused unit and E2E gates.

## Independent review fix — deterministic context-loss evidence

An independent review found that the original E2E context-loss case could pass
without dispatching `webglcontextlost`: it accepted zero canvases and guarded
the dispatch with `if (canvas.count() === 1)`.

Root-cause tracing also identified that React Three Fiber attaches
`data-testid="particle-canvas"` to its host surface, while the WebGL listener is
registered on `gl.domElement`, the nested native `<canvas>`. Dispatching against
the test-id surface therefore did not exercise the listener.

### RED

Deterministic listener command:

```text
npm test -- src/experience/ParticleScene.test.ts
```

Result: exit 1; `observeWebGLContextLoss is not a function`. This proved the
listener lifecycle had no independently testable DOM contract.

The strengthened E2E then failed on desktop Chromium when the first attempt
dispatched against the React Three Fiber host instead of the renderer canvas:
`defaultPrevented` remained false. A second focused run exposed the same timing
contract until the test targeted the native canvas and waited for the effect
listener to observe the cancelable event.

### GREEN

Focused listener and fallback command:

```text
npm test -- src/experience/ParticleScene.test.ts src/experience/ParticleExperience.test.tsx
```

Result: exit 0; 2 files and 2 tests passed. The new DOM contract proves
`preventDefault`, exactly one callback, listener removal, and no callback after
cleanup.

Focused browser command:

```text
npm run e2e -- --grep "WebGL|context|canvas"
```

Result: exit 0; 9 tests passed and 1 was explicitly skipped in 3.0 seconds.
Desktop Chromium proved WebGL availability, required exactly one native canvas,
polled until the registered listener prevented the synthetic context-loss
event, required the canvas to unmount, and then rechecked heading, portrait,
navigation, and CTAs. Mobile Chromium skips only this context-loss case because
its quality profile intentionally does not mount WebGL; its reduced-motion,
no-WebGL, and one-canvas fallback coverage still ran.

Fix commit: `73bf93a test: make WebGL context loss deterministic`.

This fix does not add a canvas, RAF, render loop, or per-frame React state. It
extracts the existing listener registration into a testable function and keeps
the same effect cleanup semantics in `ParticleScene`.

## Re-review cleanup — Fast Refresh ownership

Re-review found one Minor: exporting `observeWebGLContextLoss` from
`ParticleScene.tsx` violated the React module ownership expected by
`react-refresh/only-export-components`.

### RED

```text
npm exec eslint -- --max-warnings=0 src/experience/ParticleScene.tsx
```

Result: exit 1 with one `react-refresh/only-export-components` warning on the
non-component export.

### GREEN

The DOM listener moved unchanged to `src/experience/webgl-context-loss.ts`; its
test moved to `src/experience/webgl-context-loss.test.ts`; `ParticleScene.tsx`
now exports only the React component and imports the helper.

```text
npm test -- src/experience/webgl-context-loss.test.ts src/experience/ParticleExperience.test.tsx
npm exec eslint -- --max-warnings=0 src/experience/ParticleScene.tsx src/experience/webgl-context-loss.ts src/experience/webgl-context-loss.test.ts
git diff --check
```

Result: exit 0; 2 test files and 2 tests passed, ESLint emitted zero warnings,
and the diff check passed. E2E was not repeated because this is a pure module
ownership extraction with identical event registration and cleanup behavior.

Cleanup commit: `997d8b1 refactor: isolate WebGL context-loss listener`.
