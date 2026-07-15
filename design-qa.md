# Design QA — Portfolio visual refinement

## Comparison target

- Source visual truth: `/var/folders/y4/9bmksdfj1bjf61l9dllllwqh0000gn/T/codex-clipboard-6a552bc6-04bc-445b-95e7-109bddef4979.png` (1487 x 1058 source pixels).
- Implementation: `/pt-br` at `http://127.0.0.1:4173`.
- Required viewport: 1488 x 1058, initial Portuguese home state, scroll position 0.
- Implementation screenshot: `.superpowers/design-qa/portfolio-1488x1058.png`.
- Mobile screenshot after opening and closing the menu once: `.superpowers/design-qa/portfolio-390x844.png`.
- Baseline comparison: `.superpowers/design-qa/comparison-iteration-1-full.png`.
- Final full comparison: `.superpowers/design-qa/comparison-final-full.png`.
- Final focused comparisons: `.superpowers/design-qa/comparison-final-hero.png`, `.superpowers/design-qa/comparison-final-rail.png`, `.superpowers/design-qa/comparison-final-cta.png`, `.superpowers/design-qa/comparison-final-portrait-edge.png`, `.superpowers/design-qa/comparison-final-capability.png`, and `.superpowers/design-qa/comparison-final-project.png`.

## Capture surface

The Product Design workflow selected the Codex in-app Browser. The browser-client runtime initialized, but `agent.browsers.get("iab")` returned `Browser is not available: iab`. After reading `bootstrap-troubleshooting`, `agent.browsers.list()` returned `[]`. The approved repository Playwright fallback was therefore used. Its first sandboxed Chromium launch failed at MachPort registration with `Permission denied (1100)`; the authorized out-of-sandbox run captured and tested the local preview successfully.

## Interaction and resilience evidence

- Project anchor navigation: `Ver trabalhos` reached `#work`.
- Project route navigation: `Explore Dona Events` reached `/en/projects/dona-events`.
- Locale switching: `EN` changed `/pt-br` to `/en` without an error.
- Curriculum: `/cv-eduardo-lourenco-pt-br.pdf` returned HTTP 200.
- Keyboard: tab navigation reached a real link; mobile `Escape` closed the menu and restored focus to the toggle.
- Mobile menu: all five navigation links were visible before closing.
- Reduced motion: zero canvases mounted and the primary CTA remained visible.
- No WebGL: zero canvases mounted and the primary CTA remained visible.
- Reduced motion, Save-Data, low-memory, and no-WebGL profiles requested zero
  `ParticleScene`/`three-vendor` assets; an eligible profile requested exactly
  one `ParticleScene` asset on demand.
- Console and uncaught page errors: none across desktop, mobile, reduced-motion, and no-WebGL contexts.

## Required fidelity surfaces

- Fonts and typography: final name box is y=144 and 263.96 px high, the role begins at y=419.16, and the summary begins at y=522.14 with a 400 px measure. Disciplines use the mono face and preserved localized casing.
- Spacing and layout rhythm: capability begins at y=740; the first project card begins at y=831; Dona Events title begins at y=927.22. All three desktop CTAs share y=622.42 and a 44 px height.
- Colors and tokens: black-green base, lime accents, dividers, halo, and grid preserve the reference hierarchy. Minor halo and line-opacity differences remain P3.
- Image quality and asset fidelity: portrait and dashboard are real bounded raster assets. The right-side portrait mask and one particle field overlap through the face and torso; no custom SVG/CSS image substitute is used.
- Icons: all navigation, CTA, capability, and scroll affordances use Phosphor icons. Rail nodes, labels, and footer markers remain within the 132 px rail.
- Copy and content: Portuguese/English copy, routes, curriculum asset, and destinations remain intact. Desktop rail labels use source-faithful short copy while each link's accessible name and every mobile label preserve the full localized copy.

## Final findings

- P0: 0.
- P1: 0.
- P2: 0.
- P3: compact locale typography and small differences in rail type scale, CTA density, halo opacity, and particle distribution.

## Comparison history

### Iteration 1 — blocked

- Earlier findings: initial comparison identified four P1 and three P2 mismatches above.
- Fixes made: none yet; this is the baseline comparison.
- Post-fix evidence: not applicable.
- Result: blocked while actionable P1/P2 findings remain.

### Iteration 2 — blocked

- Earlier findings: detached dissolve, missing rail system, wrapped curriculum CTA, late first fold, wrong disciplines face, and missing scroll affordance.
- Fixes made: rebuilt the rail with Phosphor nodes/footer, overlapped portrait and particle masks, moved locale control, added the mouse hint, compacted the project preheader, and placed all desktop CTAs in one cluster.
- Post-fix evidence: `.superpowers/design-qa/portfolio-1488x1058-iteration-2.png`.
- Result: blocked by a 52.14 px document-flow offset, CTA/rail wrapping, and remaining optical scale drift.

### Iteration 3 — blocked

- Earlier findings: hidden skip link still occupied document flow; first fold and supporting hero copy remained offset.
- Fixes made: removed the selector overriding `position: fixed`; hero y moved to 0, capability to y=740, card to y=831, and CTAs remained inline.
- Post-fix evidence: `.superpowers/design-qa/portfolio-1488x1058-iteration-3.png` and `.superpowers/design-qa/comparison-iteration-3-full.png`.
- Result: blocked by two-line CTA labels, rail overflow, and optical title height.

### Iteration 4 — blocked

- Earlier findings: desktop button labels wrapped and rail labels crossed the 132 px boundary.
- Fixes made: bounded desktop button typography and padding; enabled controlled rail wrapping.
- Post-fix evidence: `.superpowers/design-qa/portfolio-1488x1058-final.png`; CTAs were all y=568.83/h=44 and rail max-right was 123 px.
- Result: blocked by title/summary vertical rhythm and first-project copy alignment.

### Iteration 5 — blocked

- Earlier findings: display title was optically short and the supporting copy/CTA sat above the source rhythm.
- Fixes made: reserved the display title's optical height, bounded the summary to 25rem, and aligned the CTA cluster to the source range.
- Post-fix evidence: `.superpowers/design-qa/portfolio-1488x1058-iteration-5.png`; name y=144/h=263.96, summary y=522.14/w=400, CTA y=622.42/h=44.
- Result: blocked only by the Dona Events title sitting below the source crop.

### Iteration 6 — passed

- Earlier findings: first-project copy was vertically centered and Dona Events title began at y=968.83.
- Fixes made: aligned project copy to the card top; title moved to y=927.22. Mobile action clusters were stacked and the particle host was bounded to remove 390 px overflow while preserving one canvas.
- Post-fix evidence: `.superpowers/design-qa/portfolio-1488x1058-iteration-6.png`, `.superpowers/design-qa/comparison-final-full.png`, and all final focused comparisons listed above.
- Result: no actionable P0/P1/P2 findings remain.

### Iteration 7 — blocked after review

- Earlier findings: desktop rail rendered full localized copy, forcing visual
  wrapping, and the manual Three/R3F group recursively captured React. The app
  statically imported and `index.html` preloaded the 233094 B gzip vendor even
  when runtime gates rejected the experience.
- RED evidence: two SiteHeader tests failed for absent short labels; the CSS
  contract failed on `white-space: normal`; the production graph contract
  failed on the `three-vendor` preload; the Portuguese Playwright rail contract
  failed with `Especialidades` ending at x=140.78.
- Result: blocked by two P1 structural/latency findings.

### Iteration 8 — passed

- Fixes made: separated full and short localized labels; desktop links expose
  the full `aria-label`, render short labels in one line, keep 44 px targets,
  and end at x=123 inside the 132 px rail. Mobile continues to render the full
  localized copy. Removed the recursive manual Three group and disabled module
  preloading; R3F/Three now live entirely inside the dynamic `ParticleScene`.
- GREEN evidence: rail labels are x=42.58/right=123, h=12.08, and
  `scrollWidth=clientWidth=80`; PT/EN rail E2E passed 4/4. Production graph
  contract passed; constrained network profiles made zero heavy requests and
  an eligible profile made exactly one on-demand request.
- Post-fix evidence: `.superpowers/design-qa/portfolio-1488x1058.png`,
  `.superpowers/design-qa/portfolio-390x844.png`, and the regenerated full and
  focused comparisons.
- Result: no actionable P0/P1/P2 findings remain.

## Follow-up polish

- [P3] Refine locale optical spacing without changing the PT-BR/EN accessible contract.
- [P3] Tune lime border opacity, CTA density, and particle distribution only if a later pixel-polish pass is desired.

final result: passed
