# Task 7 — Visual QA, resilience gates, and production verification

## Status

Passed from baseline `8ab76bacd95a2fc1b37214661ec6c936fbcfdfc5`.
The verified implementation commit is
`5a4223221bc1fd4836d61143d74895216443b35d` (`feat: deliver the
reference-faithful portfolio`). Review corrections are committed as
`655eacc` (`fix: preserve rail and lazy scene boundaries`). The final QA record
is `design-qa.md`, whose last line is exactly `final result: passed`.

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
differences are locale density, rail type scale, and small CTA, halo,
border-opacity, and particle-distribution drift.

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
7. Review reopened QA after proving that full localized rail copy wrapped and
   that the manual Three group recursively captured React, causing a static
   app import and a 233094 B gzip `three-vendor` modulepreload.
8. The desktop rail now renders short source labels while preserving full
   accessible names and full mobile labels. Removing the recursive manual
   group and module preloading puts R3F/Three entirely inside the dynamic
   `ParticleScene`. Regenerated comparisons have no P0-P2 findings.

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
- Reduced motion, Save-Data, low-memory, and no-WebGL profiles request zero
  heavy particle assets. An eligible profile requests exactly one
  `ParticleScene` asset on demand.
- Portuguese rail labels are source-short, one line, x=42.58/right=123 inside
  132 px, and have 44 px targets. `Trabalhos` retains the full accessible name
  `Trabalhos selecionados`; the mobile shell retains the full visible copy.
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
  Vitest             22 files, 56 tests passed
  Node contracts     17 tests passed
  build/content/link passed

npm run e2e          51 passed, 1 expected skip, 0 failed
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
index-DmlQ1oVo.js                              344132
eduardo-portrait-Crkpn2Ob.png                1030881
barlow-condensed-latin-700-normal-v1xN8_Wq.woff2 22444
index-FudVdUwk.css                              17877
ParticleScene-DiwRRYPO.js                      875193
dona-events-dashboard-JgUJpnrW.webp             33844
```

Measured gzip sizes are 105041 bytes for the initial app and 230252 bytes for
the dynamic `ParticleScene`, which now owns R3F/Three. `index.html` references
no heavy particle asset and the entry contains no static Three import. The
corrected initial total exceeds the legacy 102590 B budget by 2451 B; this is
reported rather than hidden in an initial vendor chunk. The previous 101201 B
app metric omitted a preloaded 233094 B Three vendor, so initial JavaScript was
approximately 334747 B. Correct initial JavaScript is now 105041 B, about 68.6%
lower, and is guarded at 106000 B against further drift.

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
- The app/particle boundary keeps R3F/Three off the primary application graph;
  no preload, parse, WebGL allocation, or RAF work occurs for rejected profiles.

## Preview handoff

`http://127.0.0.1:4173/pt-br` returned HTTP 200 after the final capture. Vite is
running with `--host 127.0.0.1 --port 4173 --strictPort`; the active listener is
Node PID 12586 (exec session 75322).

## Concerns

- Only P3 optical polish remains; another loop is not warranted by the task's
  acceptance boundary.
- The corrected 105041 B critical initial exceeds the legacy 102590 B guardrail
  by 2451 B. Preserving the old apparent number would require putting shared
  React code back into the 230252 B heavy preload, recreating the latency bug.
- Vite reports the intentionally isolated `ParticleScene` above 500 kB raw. It
  is dynamically loaded once for eligible profiles and not requested by any
  rejected capability profile.
- The in-app Browser backend was unavailable, so the repository's real-browser
  fallback supplied the required evidence.
