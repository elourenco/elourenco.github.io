# Futuristic Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the orbital-station portfolio with the approved Constructed Reality layout and one progressively loaded React Three Fiber particle field.

**Architecture:** Semantic React content remains the source of truth and renders before WebGL. A local hero experience composes the existing DOM portrait with one shader-driven `THREE.Points` field, while pure capability selection and a visibility/idle gate control whether the 3D chunk is ever downloaded or rendered.

**Tech Stack:** React 19, TypeScript 5.9, Vite 8, Three.js 0.183, React Three Fiber 9.6, Vitest 4, Testing Library, Playwright.

## Global Constraints

- Preserve `/en`, `/en/projects/dona-events`, `/pt-br`, and `/pt-br/projetos/dona-events`.
- Preserve complete HTML content, CTAs, SEO, keyboard navigation, and locale parity without WebGL.
- Use one `<Canvas>`, one `requestAnimationFrame` loop, one particle draw call, and zero React state updates per frame.
- Use 0 particles for fallback, at most 3,000 on mobile, and at most 9,000 on desktop.
- Cap DPR at 1 on mobile and 1.5 on desktop; do not add bloom.
- Do not add a runtime dependency; direct dependency versions remain exact.
- Keep main-app growth below 10 kB gzip and the display WOFF2 below 50 kB with `font-display: swap`.
- Honor `Save-Data`, `prefers-reduced-motion`, low memory, missing WebGL, viewport visibility, and tab visibility.
- Preserve the user's unrelated `.gitignore`, `.superpowers/sdd/task-4-report.md`, `dist/`, and `test-results/` changes.

---

## File Map

### Create

- `src/components/navigation/DesktopSectionRail.tsx` — desktop numbered navigation.
- `src/components/navigation/MobileSiteHeader.tsx` — compact mobile/tablet header.
- `src/features/home/HomeHero.tsx` — semantic hero composition.
- `src/features/home/HeroPortrait.tsx` — portrait, mask, and image fallback.
- `src/experience/ParticleExperience.tsx` — capability and lazy-mount boundary.
- `src/experience/ParticleScene.tsx` — canvas and renderer lifecycle.
- `src/experience/useExperienceGate.ts` — idle, viewport, and document visibility gate.
- `src/experience/particles/NeuralParticleField.tsx` — one draw-call particle mesh.
- `src/experience/particles/particle-layout.ts` — deterministic buffer generation.
- `src/experience/particles/particle-layout.test.ts` — geometry contract.
- `src/experience/particles/particle-shaders.ts` — GLSL vertex and fragment shaders.
- `src/styles/base.css` — reset, base typography, accessibility utilities.
- `src/styles/layout.css` — page shell, rail, responsive grids.
- `src/styles/components.css` — hero, buttons, sections, timeline, project page.
- `src/assets/fonts/barlow-condensed-latin-700-normal.woff2` — self-hosted display font.

### Modify

- `src/features/home/HomePage.tsx` — compose the new shell and hero.
- `src/features/home/HomePage.test.tsx` — new semantic and navigation contracts.
- `src/components/SiteHeader.tsx` — route-level shell facade.
- `src/features/home/HeroPortrait.test.tsx` — portrait lifecycle and fallback.
- `src/features/projects/DonaEventsPage.tsx` — apply shared editorial classes.
- `src/components/NotFoundPage.tsx` — apply the shared visual shell.
- `src/experience/quality.ts` and `quality.test.ts` — capability-aware profiles.
- `src/experience/AdaptiveCanvas.tsx` and test — temporary compatibility facade, then removal.
- `src/styles/tokens.css` and `globals.css` — green visual system and CSS entrypoint.
- `src/main.tsx` — preload/import local font styles only if required by final bundling.
- `e2e/portfolio.spec.ts` — fallback, reduced-motion, responsive shell, and canvas tests.
- `README.md` — architecture and measured budgets.

### Remove after replacement tests pass

- `src/experience/CosmicStation.tsx`
- `src/experience/SceneController.tsx`
- `src/experience/materials.ts`
- `src/experience/scene-state.ts`
- `src/experience/useSectionObserver.ts`
- `src/experience/useSectionObserver.test.tsx`

---

### Task 1: Capability profiles and progressive experience gate

**Files:**
- Modify: `src/experience/quality.ts`
- Modify: `src/experience/quality.test.ts`
- Create: `src/experience/useExperienceGate.ts`
- Create: `src/experience/useExperienceGate.test.tsx`

**Interfaces:**
- Produces: `selectQualityProfile(input: QualityProfileInput): QualityProfile`.
- Produces: `useExperienceGate(input: ExperienceGateInput): ExperienceGateState`.
- `QualityProfile` is `{ enabled: boolean; dpr: [number, number]; particles: number }`.
- `ExperienceGateState` is `{ ready: boolean; visible: boolean }`.

- [ ] **Step 1: Replace quality tests with the approved budgets**

```ts
expect(selectQualityProfile({
  webgl: false,
  reducedMotion: false,
  saveData: false,
  mobile: false,
  memoryGb: 8,
})).toEqual({ enabled: false, dpr: [1, 1], particles: 0 });

expect(selectQualityProfile({
  webgl: true,
  reducedMotion: false,
  saveData: false,
  mobile: true,
  memoryGb: 8,
})).toEqual({ enabled: true, dpr: [1, 1], particles: 3000 });

expect(selectQualityProfile({
  webgl: true,
  reducedMotion: false,
  saveData: false,
  mobile: false,
  memoryGb: 8,
})).toEqual({ enabled: true, dpr: [1, 1.5], particles: 9000 });
```

Cover every disabling capability explicitly:

```ts
const disabledInputs: QualityProfileInput[] = [
  { webgl: true, reducedMotion: true, saveData: false, mobile: false, memoryGb: 8 },
  { webgl: true, reducedMotion: false, saveData: true, mobile: false, memoryGb: 8 },
  { webgl: true, reducedMotion: false, saveData: false, mobile: true, memoryGb: 2 },
];

for (const input of disabledInputs) {
  expect(selectQualityProfile(input)).toEqual({
    enabled: false,
    dpr: [1, 1],
    particles: 0,
  });
}
```

- [ ] **Step 2: Run the quality tests and verify the old shape fails**

Run: `npm test -- --run src/experience/quality.test.ts`

Expected: FAIL because the current profile still exposes `shadows` and `postprocessing` and uses 300/900 particles.

- [ ] **Step 3: Implement the pure capability selector**

```ts
export interface QualityProfile {
  enabled: boolean;
  dpr: [number, number];
  particles: number;
}

export interface QualityProfileInput {
  webgl: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  mobile: boolean;
  memoryGb?: number;
}

const DISABLED: QualityProfile = {
  enabled: false,
  dpr: [1, 1],
  particles: 0,
};

export function selectQualityProfile(input: QualityProfileInput): QualityProfile {
  if (
    !input.webgl ||
    input.reducedMotion ||
    input.saveData ||
    (input.mobile && (input.memoryGb ?? 4) <= 2)
  ) {
    return DISABLED;
  }

  return input.mobile || (input.memoryGb ?? 4) < 8
    ? { enabled: true, dpr: [1, 1], particles: 3000 }
    : { enabled: true, dpr: [1, 1.5], particles: 9000 };
}
```

- [ ] **Step 4: Add gate tests using fake idle and intersection callbacks**

Test these observable transitions: ineligible stays `{ ready: false, visible: false }`; eligible does not become ready before idle; idle makes it ready; intersection makes it visible; `document.hidden` makes it invisible; unmount cancels callbacks and disconnects the observer.

Use a typed test double:

```ts
let idleCallback: IdleRequestCallback | undefined;
window.requestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
  idleCallback = callback;
  return 7;
});
window.cancelIdleCallback = vi.fn();
```

- [ ] **Step 5: Implement `useExperienceGate` without timers that outlive unmount**

```ts
export interface ExperienceGateInput {
  eligible: boolean;
  target: React.RefObject<Element | null>;
}

export interface ExperienceGateState {
  ready: boolean;
  visible: boolean;
}
```

Schedule `requestIdleCallback(callback, { timeout: 1200 })`, with a `setTimeout(callback, 400)` fallback. Observe `target.current` at threshold `0.05`. Derive visibility as `intersecting && document.visibilityState === 'visible'`. Cleanup must cancel the idle handle or timeout, remove `visibilitychange`, and disconnect `IntersectionObserver`.

- [ ] **Step 6: Run focused tests**

Run: `npm test -- --run src/experience/quality.test.ts src/experience/useExperienceGate.test.tsx`

Expected: both files PASS with no leaked timer warning.

- [ ] **Step 7: Commit the capability boundary**

```bash
git add src/experience/quality.ts src/experience/quality.test.ts src/experience/useExperienceGate.ts src/experience/useExperienceGate.test.tsx
git commit -m "feat: gate the adaptive particle experience"
```

---

### Task 2: Deterministic single-draw-call particle scene

**Files:**
- Create: `src/experience/particles/particle-layout.ts`
- Create: `src/experience/particles/particle-layout.test.ts`
- Create: `src/experience/particles/particle-shaders.ts`
- Create: `src/experience/particles/NeuralParticleField.tsx`
- Create: `src/experience/ParticleScene.tsx`
- Modify: `src/experience/AdaptiveCanvas.test.tsx`
- Create: `src/experience/ParticleExperience.tsx`

**Interfaces:**
- Consumes: `QualityProfile` and `useExperienceGate` from Task 1.
- Produces: `buildParticleLayout(count: number, seed?: number): ParticleLayout`.
- Produces: `ParticleExperience({ className?: string }): JSX.Element`.
- `ParticleLayout` is `{ positions: Float32Array; phases: Float32Array; sizes: Float32Array }`.

- [ ] **Step 1: Write deterministic layout tests**

```ts
const first = buildParticleLayout(32, 197);
const second = buildParticleLayout(32, 197);

expect(first.positions).toHaveLength(96);
expect(first.phases).toHaveLength(32);
expect(first.sizes).toHaveLength(32);
expect([...first.positions]).toEqual([...second.positions]);
expect([...first.positions]).not.toContain(Number.NaN);
expect(Math.max(...first.sizes)).toBeLessThanOrEqual(2.4);
expect(Math.min(...first.sizes)).toBeGreaterThanOrEqual(0.6);
```

Also assert the empty boundary:

```ts
expect(buildParticleLayout(0)).toEqual({
  positions: new Float32Array(),
  phases: new Float32Array(),
  sizes: new Float32Array(),
});
```

- [ ] **Step 2: Run the layout test and verify the missing module fails**

Run: `npm test -- --run src/experience/particles/particle-layout.test.ts`

Expected: FAIL with module-not-found.

- [ ] **Step 3: Implement seeded toroidal-cloud buffers**

Use a local Mulberry32 generator and fill typed arrays in one pass. For normalized `t = index / count`, use:

```ts
const angle = t * Math.PI * 12 + random() * 0.35;
const ring = 3.6 + Math.sin(t * Math.PI * 7) * 1.1 + random() * 0.7;
positions[offset] = Math.cos(angle) * ring;
positions[offset + 1] = (random() - 0.5) * 5.6;
positions[offset + 2] = Math.sin(angle) * ring + (random() - 0.5) * 1.8;
phases[index] = random() * Math.PI * 2;
sizes[index] = 0.6 + random() * 1.8;
```

Return empty arrays before dividing when `count <= 0`.

- [ ] **Step 4: Add production GLSL modules**

`particle-shaders.ts` must export `particleVertexShader` and `particleFragmentShader`. The vertex shader consumes `phase` and `pointSize`, animates only position with `uTime`, and scales `gl_PointSize` by perspective. The fragment shader renders a soft circular point with alpha discard at radius `0.5`; it must not contain texture sampling or dynamic loops.

- [ ] **Step 5: Implement `NeuralParticleField`**

Memoize the layout by `count`, create one `<points frustumCulled={false}>`, attach `position`, `phase`, and `pointSize` buffer attributes, and use one `shaderMaterial` with `transparent`, `depthWrite={false}`, and additive blending. In `useFrame`, mutate only `materialRef.current.uniforms.uTime.value`; do not call React setters.

- [ ] **Step 6: Replace the canvas test contract before implementation**

Update `AdaptiveCanvas.test.tsx` to assert:

```ts
expect(screen.getByTestId('experience-fallback')).toBeVisible();
expect(screen.queryByTestId('particle-canvas')).not.toBeInTheDocument();
```

for WebGL failure, reduced motion, and forced fallback. Add an eligible case that runs the idle/intersection callbacks and expects `particle-canvas`.

- [ ] **Step 7: Implement the scene and progressive boundary**

`ParticleScene` owns `<Canvas data-testid="particle-canvas">`, uses the selected DPR, `gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}`, no shadows, no postprocessing, camera `{ position: [0, 0, 10], fov: 42 }`, and a transparent background.

`ParticleExperience` must:

1. detect WebGL without throwing;
2. read reduced motion, coarse pointer/mobile, `navigator.deviceMemory`, and `navigator.connection?.saveData`;
3. select a quality profile;
4. call `useExperienceGate` against its host element;
5. render `ExperienceFallback` until eligible, ready, and visible;
6. lazy-import `ParticleScene` only after the gate opens;
7. isolate import/render failure with the existing `ErrorBoundary`.

Use a local browser capability type instead of mutating global DOM types:

```ts
interface NavigatorWithCapabilities extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}
```

`ParticleScene` receives `onContextLost: () => void`. Register a
`webglcontextlost` listener on `gl.domElement` in `onCreated`, call
`event.preventDefault()` and `onContextLost()`, and remove the listener during
cleanup. `ParticleExperience` switches permanently to `ExperienceFallback`
after that callback; it does not attempt an automatic recreation loop.

- [ ] **Step 8: Run the particle unit suite**

Run: `npm test -- --run src/experience/particles/particle-layout.test.ts src/experience/AdaptiveCanvas.test.tsx src/experience/quality.test.ts src/experience/useExperienceGate.test.tsx`

Expected: PASS; React reports no state update during a mocked frame.

- [ ] **Step 9: Commit the replacement runtime**

```bash
git add src/experience
git commit -m "feat: add the progressive neural particle scene"
```

---

### Task 3: Responsive navigation shell

**Files:**
- Create: `src/components/navigation/DesktopSectionRail.tsx`
- Create: `src/components/navigation/MobileSiteHeader.tsx`
- Modify: `src/components/SiteHeader.tsx`
- Create: `src/components/SiteHeader.test.tsx`
- Modify: `src/features/home/HomePage.tsx`

**Interfaces:**
- Consumes: `PortfolioContent`, `RouteKey`, `HOME_SECTION_ANCHORS`, and `INTERNAL_DESTINATIONS`.
- Produces: the existing `SiteHeaderProps` API unchanged.

- [ ] **Step 1: Write shell tests for home and project routes**

Assert one primary navigation landmark, exact localized hrefs, one accessible home link, the desktop rail indices `01` through `05` as `aria-hidden`, and one language switcher. On a Dona route, assert every home section href includes the localized home path before the fragment.

- [ ] **Step 2: Run the test and verify the missing split components fail**

Run: `npm test -- --run src/components/SiteHeader.test.tsx`

Expected: FAIL because `SiteHeader` still renders one horizontal header.

- [ ] **Step 3: Implement navigation data once in `SiteHeader`**

Build one immutable list with home plus the four existing anchors:

```ts
const items = [
  { index: '01', label: isPortuguese ? 'Início' : 'Home', href: homeHref },
  ...HOME_SECTION_ANCHORS.map((id, offset) => ({
    index: String(offset + 2).padStart(2, '0'),
    label: labels[id],
    href: isHome
      ? INTERNAL_DESTINATIONS.fragment(id)
      : INTERNAL_DESTINATIONS.routeFragment(content.locale, 'home', id),
  })),
] as const;
```

Pass the same list to `DesktopSectionRail` and `MobileSiteHeader`; do not duplicate routing logic.

- [ ] **Step 4: Implement both renderers with one visible breakpoint each**

`DesktopSectionRail` renders the brand, `<nav aria-label>`, numbered anchors, and no language switcher. `MobileSiteHeader` renders the brand plus a native disclosure button with `aria-expanded`; its links close the disclosure after activation. `SiteHeader` owns the single `LanguageSwitcher` positioned independently so both shells do not duplicate it.

- [ ] **Step 5: Run component and home contract tests**

Run: `npm test -- --run src/components/SiteHeader.test.tsx src/features/home/HomePage.test.tsx src/components/LanguageSwitcher.test.tsx`

Expected: PASS after updating only the expected accessible heading name in the later hero task; all href arrays remain unchanged.

- [ ] **Step 6: Commit the shell**

```bash
git add src/components/navigation src/components/SiteHeader.tsx src/components/SiteHeader.test.tsx src/features/home/HomePage.tsx
git commit -m "feat: add the responsive signal navigation"
```

---

### Task 4: Semantic Constructed Reality hero

**Files:**
- Create: `src/features/home/HomeHero.tsx`
- Create: `src/features/home/HeroPortrait.tsx`
- Create: `src/features/home/HomeHero.test.tsx`
- Modify: `src/features/home/HomePage.tsx`
- Modify: `src/features/home/HomePage.test.tsx`
- Create: `src/features/home/HeroPortrait.test.tsx`
- Remove: `src/features/profile/HeroSection.tsx`
- Remove: `src/components/ProfilePortrait.tsx`
- Remove: `src/components/ProfilePortrait.test.tsx`

**Interfaces:**
- Consumes: `PortfolioContent`, `ParticleExperience`, and existing site destinations.
- Produces: `HomeHero({ content }: { content: PortfolioContent }): JSX.Element`.
- Produces: `HeroPortrait({ alt, priority }: { alt: string; priority?: boolean }): JSX.Element`.

- [ ] **Step 1: Write hero tests using real localized content**

Assert the English accessible `h1` name is `Eduardo Lourenco Principal Software Engineer`, Portuguese disciplines remain visible, all three CTA contracts are unchanged, the image keeps `width="752"`, `height="752"`, eager/high priority, and a failed image shows `EL` while hiding the broken image.

- [ ] **Step 2: Run hero tests and verify the new heading contract fails**

Run: `npm test -- --run src/features/home/HomeHero.test.tsx src/features/home/HomePage.test.tsx`

Expected: FAIL because the current `h1` contains only the role.

- [ ] **Step 3: Implement the semantic hero composition**

```tsx
<section className="home-hero section-shell" aria-labelledby={SITE_ANCHORS.home.heroTitle}>
  <div className="home-hero__content">
    <h1 id={SITE_ANCHORS.home.heroTitle} className="home-hero__title">
      <span className="home-hero__name">{content.hero.eyebrow}</span>
      <span className="home-hero__role">{content.hero.title}</span>
    </h1>
    <p className="home-hero__disciplines">{content.hero.disciplines}</p>
    <p className="home-hero__summary">{content.hero.summary}</p>
    <HeroActions content={content} />
  </div>
  <div className="home-hero__visual">
    <HeroPortrait alt={portraitAlt} priority />
    <ParticleExperience className="home-hero__particles" />
  </div>
</section>
```

Keep `HeroActions` private to `HomeHero.tsx`; it uses the existing three URLs and labels exactly.

- [ ] **Step 4: Implement robust portrait state**

Start with `data-image-state="loading"`; set `ready` in `onLoad` and `fallback` in `onError`. Keep the 752×752 intrinsic dimensions. The fallback initials are text in an `aria-hidden` layer; the `<img alt>` remains the only accessible visual description. Do not put the particle canvas inside `<figure>`.

- [ ] **Step 5: Replace `HeroSection` in `HomePage` and update tests**

Remove scene-section observation and its mapping from `HomePage`; render `HomeHero` directly. Update only heading expectations and decorative markers. Preserve `pageInternalLinks(locale, 'home')` equality.

- [ ] **Step 6: Run the semantic suite**

Run: `npm test -- --run src/features/home/HomeHero.test.tsx src/features/home/HomePage.test.tsx src/features/home/HeroPortrait.test.tsx`

Expected: PASS in both locales, including the image-error case.

- [ ] **Step 7: Commit the hero**

```bash
git add src/features/home src/features/profile/HeroSection.tsx src/components/ProfilePortrait.tsx src/components/ProfilePortrait.test.tsx
git commit -m "feat: build the constructed reality hero"
```

---

### Task 5: Green editorial design system and secondary routes

**Files:**
- Create: `src/assets/fonts/barlow-condensed-latin-700-normal.woff2`
- Create: `src/styles/base.css`
- Create: `src/styles/layout.css`
- Create: `src/styles/components.css`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/globals.css`
- Modify: `src/features/expertise/ExpertiseSection.tsx`
- Modify: `src/features/projects/FeaturedProject.tsx`
- Modify: `src/features/career/CareerTimeline.tsx`
- Modify: `src/features/contact/ContactSection.tsx`
- Modify: `src/features/projects/DonaEventsPage.tsx`
- Modify: `src/components/NotFoundPage.tsx`

**Interfaces:**
- Consumes: existing semantic markup and content; no content-schema changes.
- Produces: CSS custom properties and class contracts only.

- [ ] **Step 1: Acquire the pinned self-hosted font without keeping a package dependency**

Run:

```bash
npm pack @fontsource/barlow-condensed@5.2.8
tar -xzf fontsource-barlow-condensed-5.2.8.tgz package/files/barlow-condensed-latin-700-normal.woff2
mv package/files/barlow-condensed-latin-700-normal.woff2 src/assets/fonts/
rm -rf package fontsource-barlow-condensed-5.2.8.tgz
```

Verify: `wc -c src/assets/fonts/barlow-condensed-latin-700-normal.woff2`

Expected: a non-zero value below 50,000 bytes. Verify `git diff -- package.json package-lock.json` is empty.

- [ ] **Step 2: Replace visual tokens atomically**

Define the following stable tokens in `tokens.css` and remove the cyan aliases after all consumers move:

```css
:root {
  color-scheme: dark;
  --color-void: #020503;
  --color-surface: #071009;
  --color-signal: #a8ff3e;
  --color-signal-soft: #d3ff9e;
  --color-signal-dim: rgb(168 255 62 / 22%);
  --color-text: #f2f0e9;
  --color-muted: #a5aaa3;
  --color-line: rgb(168 255 62 / 24%);
  --font-display: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  --font-sans: Inter, ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'SFMono-Regular', Consolas, monospace;
  --layer-scene: 0;
  --layer-content: 1;
  --layer-nav: 10;
  --layer-skip: 20;
}
```

Add `@font-face` in `base.css` with local asset URL, weight 700, style normal, `font-display: swap`.

- [ ] **Step 3: Split `globals.css` without changing import order**

`globals.css` becomes exactly:

```css
@import './tokens.css';
@import './base.css';
@import './layout.css';
@import './components.css';
```

Move reset/focus/typography into `base.css`; shell, rail, containers, grids, and media queries into `layout.css`; hero, portrait, buttons, feature, expertise, timeline, contact, Dona, 404, canvas, and fallback into `components.css`.

- [ ] **Step 4: Implement the approved visual composition**

Required CSS contracts:

- desktop rail width `8.25rem`, hidden at `max-width: 800px`;
- hero minimum height `100svh`, content/visual split `minmax(0, 0.9fr) minmax(24rem, 1.1fr)`;
- display title uses `clamp(4.5rem, 9vw, 8.5rem)` and a maximum of two visual name lines;
- portrait uses an explicit `aspect-ratio: 1`, reserved width, and a right-edge mask;
- particle host is absolute, pointerless, behind the portrait text layer;
- expertise uses dividers instead of card shadows;
- Dona metric is oversized editorial type, not a fake dashboard;
- mobile uses one column, normal document flow, 44 px targets, and no horizontal overflow;
- reduced motion removes masks/scan animation and leaves the static portrait fully visible.

- [ ] **Step 5: Add semantic classes to secondary sections and routes**

Do not change text or element order. Add BEM classes to existing article/section/list elements so the shared tokens style home, Dona Events, and 404 consistently. Keep all current IDs, `aria-labelledby`, external-link attributes, and localized labels.

- [ ] **Step 6: Run formatting, unit tests, typecheck, and build**

Run: `npm run format:check && npm run lint && npm run typecheck && npm run test:run && npm run build`

Expected: all commands PASS; Vite still emits a separate Three vendor chunk, and no new runtime package appears in `package.json`.

- [ ] **Step 7: Commit the visual system**

```bash
git add src/assets/fonts src/styles src/features src/components/NotFoundPage.tsx
git commit -m "feat: apply the constructed reality design system"
```

---

### Task 6: Remove the orbital runtime and close browser contracts

**Files:**
- Remove: `src/experience/CosmicStation.tsx`
- Remove: `src/experience/SceneController.tsx`
- Remove: `src/experience/materials.ts`
- Remove: `src/experience/scene-state.ts`
- Remove: `src/experience/useSectionObserver.ts`
- Remove: `src/experience/useSectionObserver.test.tsx`
- Remove: `src/experience/AdaptiveCanvas.tsx`
- Rename/modify: `src/experience/AdaptiveCanvas.test.tsx` to `src/experience/ParticleExperience.test.tsx`
- Modify: `e2e/portfolio.spec.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: completed `ParticleExperience`, responsive shell, and visual system.
- Produces: one production 3D runtime with measured budgets and full fallback coverage.

- [ ] **Step 1: Add browser tests before deleting compatibility files**

Add Playwright cases that:

1. assert the desktop rail and Constructed Reality heading at 1440×1024;
2. assert the mobile header and no horizontal overflow at 390×844;
3. emulate `reducedMotion: 'reduce'` and assert no `particle-canvas`;
4. stub WebGL unavailable and assert CTAs remain visible;
5. assert exactly one `canvas` when WebGL is available and the idle gate opens;
6. navigate below the hero and assert semantic content remains interactive.

Use `expect.poll(() => page.locator('canvas').count()).toBeLessThanOrEqual(1)` so unavailable CI WebGL does not create a false failure.

- [ ] **Step 2: Run E2E against the compatibility state**

Run: `npm run e2e`

Expected: PASS before deletion; if CI lacks WebGL, the fallback branch passes and the canvas upper-bound still holds.

- [ ] **Step 3: Remove the old scene graph and stale observer imports**

Delete the listed files and use `rg "CosmicStation|SceneController|scene-state|useSectionObserver|AdaptiveCanvas|materials" src`.

Expected: no production references; only migration history in docs may remain.

- [ ] **Step 4: Run the full project gate**

Run: `npm run check && npm run e2e`

Expected: format, lint, typecheck, unit tests, manifest tests, build, localized-content checks, link checks, and all browser projects PASS.

- [ ] **Step 5: Measure artifact budgets**

Run:

```bash
npm run build
find dist/assets -maxdepth 1 -type f -print0 | xargs -0 -n1 sh -c 'printf "%s " "$0"; wc -c < "$0"'
gzip -c dist/assets/index-*.js | wc -c
gzip -c dist/assets/ParticleScene-*.js | wc -c
```

Compare with the README baseline: app `92.59 kB` gzip and Three vendor `239.74 kB` gzip. Main-app growth must remain below 10 kB gzip. Record actual file names and sizes; do not claim FPS without a real browser profile.

- [ ] **Step 6: Perform visual and runtime QA**

Capture 1440×1024, 834×1194, and 390×844. Compare against the approved image for hierarchy, black/green palette, portrait dissolution, whitespace, rail, and Dona teaser. In browser performance tools, verify one RAF loop, no React commit per frame, pause when the tab is hidden, and no retained WebGL resources after route teardown.

- [ ] **Step 7: Update operational documentation**

Replace the orbital-station description in `README.md` with the particle architecture, the gate conditions, the measured post-change chunk table, the exact validation commands, and any measured FPS/device evidence. Preserve the existing warning that unmeasured performance must not be presented as proven.

- [ ] **Step 8: Commit the cleanup and evidence**

```bash
git add src/experience e2e/portfolio.spec.ts README.md
git commit -m "refactor: retire the orbital portfolio runtime"
```

---

## Final Verification Checklist

- [ ] `npm run check` passes.
- [ ] `npm run e2e` passes on desktop and mobile projects.
- [ ] `npm audit --omit=dev` reports no production vulnerability.
- [ ] All four canonical routes load directly.
- [ ] English and Portuguese retain recursive content parity.
- [ ] WebGL-off, reduced-motion, Save-Data, and low-memory profiles keep the site usable.
- [ ] Exactly zero or one canvas exists; the orbital scene is absent from the production bundle.
- [ ] Main-app gzip growth is below 10 kB and font WOFF2 is below 50 kB.
- [ ] Visual captures match direction 2 at the three required viewports.
- [ ] Unrelated pre-existing workspace changes remain untouched.
