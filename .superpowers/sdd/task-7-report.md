# Task 7 — Visual QA, resilience gates, and production verification

## Status

Passed from baseline `8ab76bacd95a2fc1b37214661ec6c936fbcfdfc5`.
The verified implementation commit is
`5a4223221bc1fd4836d61143d74895216443b35d` (`feat: deliver the
reference-faithful portfolio`). The final QA record is `design-qa.md`, whose
last line is exactly `final result: passed`.

## Visual evidence

- Approved reference: `/var/folders/y4/9bmksdfj1bjf61l9dllllwqh0000gn/T/codex-clipboard-6a552bc6-04bc-445b-95e7-109bddef4979.png`
- Current 1488 x 1058 capture: `.superpowers/design-qa/portfolio-1488x1058.png`
- Current 390 x 844 capture: `.superpowers/design-qa/portfolio-390x844.png`
- Full side-by-side: `.superpowers/design-qa/comparison-final-full.png`
- Focused side-by-sides: `.superpowers/design-qa/comparison-final-hero.png`,
  `.superpowers/design-qa/comparison-final-rail.png`,
  `.superpowers/design-qa/comparison-final-cta.png`,
  `.superpowers/design-qa/comparison-final-portrait-edge.png`,
  `.superpowers/design-qa/comparison-final-capability.png`, and
  `.superpowers/design-qa/comparison-final-project.png`

The source, current desktop capture, mobile capture, full comparison, and all
six focused comparisons are present and were inspected after the final CSS
change. Final finding counts are P0=0, P1=0, P2=0. Remaining P3-only optical
differences are locale density, controlled rail wrapping for longer localized
copy, and small CTA, halo, border-opacity, and particle-distribution drift.

## Comparison history

1. The baseline exposed four P1 and three P2 mismatches: detached dissolve,
   incomplete rail, wrapped curriculum CTA, late first fold, wrong discipline
   face, and absent scroll affordance.
2. Structural reconstruction established the bounded rail, overlapping
   portrait/particle field, top-right locale, desktop CTA cluster, and scroll
   hint. A hidden skip link still contributed 52.14 px to document flow.
3. Correcting skip-link positioning restored hero y=0, capability y=740, and
   feature-card y=831. CTA wrapping and rail overflow remained.
4. Bounded CTA typography/padding and controlled rail wrapping closed the
   overflow, leaving optical vertical rhythm.
5. Title optical height, 25 rem summary measure, and CTA position were aligned.
6. Top-aligned project copy moved Dona Events from y=968.83 to y=927.22;
   mobile actions were stacked and the particle host bounded. No actionable
   P0-P2 remained.

Structural mismatches received RED assertions before the smallest production
fix, followed by focused GREEN runs. The final CSS contract, component tests,
responsive Playwright assertions, and complete gate all pass.

## Browser, interaction, and failure-path evidence

The Product Design workflow first selected the Codex in-app Browser. Its
runtime initialized, but `agent.browsers.get("iab")` reported that `iab` was
unavailable and `agent.browsers.list()` returned an empty list. After the
required troubleshooting check, the approved repository Playwright fallback
was used. Sandboxed Chromium was denied MachPort registration; the authorized
headless run then captured and exercised the local preview.

- `Ver trabalhos` reaches `#work`.
- Project navigation reaches `/en/projects/dona-events`.
- Locale switching reaches `/en` without an error.
- `/cv-eduardo-lourenco-pt-br.pdf` returns HTTP 200.
- Keyboard tabbing reaches a real link; mobile Escape closes the menu and
  restores focus to the toggle.
- All five mobile navigation links are present.
- Reduced motion and no-WebGL each mount zero canvases while preserving the
  primary CTA.
- WebGL context-loss, Save-Data, low-memory, one-canvas, and responsive-width
  paths pass in the complete Playwright suite.
- Desktop, mobile, reduced-motion, and no-WebGL runs produced no console or
  uncaught page errors.

## Final gates

Fresh verification after all runtime changes:

```text
npm run check        passed
  Prettier           passed
  ESLint             passed
  TypeScript         passed
  Vitest             22 files, 55 tests passed
  Node contracts     16 tests passed
  build/content/link passed

npm run e2e          49 passed, 1 expected skip, 0 failed
npm run build        passed
npm audit --omit=dev found 0 vulnerabilities
git diff --check     passed
```

The expected skip is the ineligible WebGL context-loss case in one Playwright
project; no eligible context-loss test failed. Development-only dependencies
were not audited because the required production gate is
`npm audit --omit=dev`.

## Production assets

Fresh `dist/assets` byte counts:

```text
index-Dxtly_5o.js                              332632
eduardo-portrait-Crkpn2Ob.png                1030881
barlow-condensed-latin-700-normal-v1xN8_Wq.woff2 22444
rolldown-runtime-QTnfLwEv.js                     694
index-DT1XtuZ2.css                              17864
ParticleScene-CXH7HEvE.js                        3162
dona-events-dashboard-JgUJpnrW.webp             33844
three-vendor-CTAtCiMJ.js                        883519
```

Measured gzip sizes are 101201 bytes for the app chunk and 1520 bytes for the
particle chunk; the Three.js vendor chunk is 233094 bytes gzip. App,
`ParticleScene`, and Three.js remain separately chunked. README records the
fresh hashed names and sizes. The app chunk remains 9.90 kB over the 92.59 kB
baseline, within the 10 kB budget.

## Performance, concurrency, and resilience

- The visual refinement adds no runtime dependency, request, job, resize/scroll
  listener, or extra React render loop.
- One progressive particle canvas remains the concurrency boundary; reduced
  motion, Save-Data, low-memory, no-WebGL, and context-loss degrade without
  blocking navigation or CTA throughput.
- Responsive geometry uses bounded tracks and local clipping at the visual
  owner, preventing horizontal overflow without masking unrelated layout bugs.
- The rail and header have mutually exclusive responsive ownership, so delayed
  font/image decode does not create duplicate navigation surfaces.
- The split app/particle/vendor chunks preserve initial-load latency and keep
  Three.js off the primary application chunk.

## Preview handoff

`http://127.0.0.1:4173/pt-br` returned HTTP 200 after the final capture. Vite is
running with `--host 127.0.0.1 --port 4173 --strictPort`; the active listener is
Node PID 12586 (exec session 75322).

## Concerns

- Only P3 optical polish remains; another loop is not warranted by the task's
  acceptance boundary.
- Vite reports the intentionally isolated Three.js vendor chunk above 500 kB
  raw. It is lazy-separated from the app chunk, gzip is 233094 bytes, and the
  resilience paths avoid mounting it when the capability gate rejects WebGL.
- The in-app Browser backend was unavailable, so the repository's real-browser
  fallback supplied the required evidence.
