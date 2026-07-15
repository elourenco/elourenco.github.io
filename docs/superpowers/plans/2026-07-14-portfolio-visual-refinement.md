# Portfolio Visual Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing bilingual portfolio so its 1488 x 1058 desktop state faithfully matches the approved reference while preserving responsive navigation, progressive WebGL, accessibility, and production performance.

**Architecture:** Keep semantic React content and routing as the source of truth, replace the square beach portrait with an alpha asset, and isolate the dissolve animation in the existing lazy Three.js boundary. CSS owns the reference-aligned layout, gradients, grid, cards, and responsive breakpoints; IntersectionObserver owns active navigation and one-shot section reveals without per-frame React updates.

**Tech Stack:** React 19.2.7, TypeScript 5.9.3, Vite 8.1.4, Three.js 0.183.2, React Three Fiber 9.6.1, Vitest 4.1.10, Playwright 1.55.0, Phosphor Icons 2.1.10, Sharp 0.35.3.

## Global Constraints

- The source visual truth is `/var/folders/y4/9bmksdfj1bjf61l9dllllwqh0000gn/T/codex-clipboard-6a552bc6-04bc-445b-95e7-109bddef4979.png` at 1488 x 1058.
- Preserve all existing Portuguese and English copy, routes, destinations, SEO, and locale behavior.
- Keep dependencies pinned to exact versions; do not introduce version ranges.
- Keep at most one WebGL canvas and keep Three.js outside the critical synchronous bundle.
- WebGL failure, context loss, Save-Data, reduced motion, and low-memory profiles must preserve content, portrait, navigation, and CTAs.
- Do not update React state from the animation frame loop.
- Desktop rail begins at 1180 px; 768-1179 px uses the compact header; below 768 px uses the mobile menu.
- The 1488 x 1058 viewport must show the capability strip and the beginning of Dona Events in the first fold.
- No horizontal overflow is allowed at 390, 768, 1024, 1440, or 1488 px.
- `design-qa.md` may finish with `final result: passed` only when no actionable P0, P1, or P2 differences remain.

## File Structure

- `scripts/prepare-visual-assets.mjs`: deterministic chroma-key and web asset optimization; never shipped to the browser.
- `scripts/visual-assets.test.mjs`: verifies alpha, dimensions, format, and byte budgets for final raster assets.
- `src/assets/eduardo-portrait.png`: optimized transparent portrait consumed only by the hero.
- `src/assets/dona-events-dashboard.webp`: product preview consumed only by FeaturedProject.
- `src/components/navigation/useActiveSection.ts`: observes stable section IDs and exposes the active ID.
- `src/components/navigation/useActiveSection.test.tsx`: deterministic observer contract.
- `src/components/useRevealOnView.ts`: one-shot reveal state with reduced-motion and missing-observer fallback.
- `src/components/useRevealOnView.test.tsx`: reveal and fallback contracts.
- `src/features/home/CapabilityStrip.tsx`: localized four-item capability strip and icon mapping.
- Existing feature components remain responsible for their own semantic sections; avoid a parallel page system.
- Existing CSS files retain their responsibilities: tokens, base primitives, layout geometry, and component appearance.

---

### Task 1: Produce Real Visual Assets and Pin Asset Dependencies

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `scripts/prepare-visual-assets.mjs`
- Create: `scripts/visual-assets.test.mjs`
- Create: `src/assets/eduardo-portrait.png`
- Create: `src/assets/dona-events-dashboard.webp`

**Interfaces:**
- Consumes: the current `src/assets/eduardo-profile.jpg` and the approved reference image.
- Produces: `eduardo-portrait.png` with alpha and intrinsic dimensions no larger than 1100 x 1250; `dona-events-dashboard.webp` no larger than 1200 x 760 and 350 kB.

- [ ] **Step 1: Pin the icon and image-processing dependencies**

Run:

```bash
npm install --save-exact @phosphor-icons/react@2.1.10
npm install --save-dev --save-exact sharp@0.35.3
```

Expected: `package.json` contains exact strings `"@phosphor-icons/react": "2.1.10"` and `"sharp": "0.35.3"`; `package-lock.json` is updated.

- [ ] **Step 2: Write the failing asset contract**

Create `scripts/visual-assets.test.mjs`:

```js
import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const portraitUrl = new URL(
  '../src/assets/eduardo-portrait.png',
  import.meta.url,
);
const dashboardUrl = new URL(
  '../src/assets/dona-events-dashboard.webp',
  import.meta.url,
);

test('portrait is a bounded raster with real alpha', async () => {
  const metadata = await sharp(fileURLToPath(portraitUrl)).metadata();
  const file = await stat(portraitUrl);

  assert.equal(metadata.format, 'png');
  assert.equal(metadata.hasAlpha, true);
  assert.ok((metadata.width ?? Infinity) <= 1100);
  assert.ok((metadata.height ?? Infinity) <= 1250);
  assert.ok(file.size <= 1_500_000);
});

test('Dona Events preview is a bounded webp', async () => {
  const metadata = await sharp(fileURLToPath(dashboardUrl)).metadata();
  const file = await stat(dashboardUrl);

  assert.equal(metadata.format, 'webp');
  assert.ok((metadata.width ?? Infinity) <= 1200);
  assert.ok((metadata.height ?? Infinity) <= 760);
  assert.ok(file.size <= 350_000);
});
```

- [ ] **Step 3: Run the asset contract and verify RED**

Run:

```bash
node --test scripts/visual-assets.test.mjs
```

Expected: FAIL with `Input file is missing` for `eduardo-portrait.png` or `dona-events-dashboard.webp`.

- [ ] **Step 4: Generate the portrait source with ImageGen**

Use the built-in image editing tool with both the current portrait and approved reference attached. Use this exact art direction:

```text
Preserve Eduardo's illustrated face, hair, glasses, beard, warm skin palette, black shirt, front-facing pose, and recognizable identity from the supplied portrait. Recompose it as a head-and-upper-torso portrait matching the approved portfolio reference. Remove the beach, sky, sea, palms, frame, text, particles, grid, and every environmental element. Place only the isolated subject on a perfectly uniform #ff00ff chroma background with no shadow, glow, reflection, magenta light spill, text, or border. Keep crisp illustrated hair edges and a 4:5 vertical composition, 1024 x 1280.
```

Save the generated output as `/tmp/eduardo-portrait-chroma.png`. Inspect it before continuing; reject it if the background is not uniform or identity drift is visible.

- [ ] **Step 5: Generate the Dona dashboard source with ImageGen**

Use the approved reference as the art-direction input and this exact prompt:

```text
Create a clean dark SaaS analytics dashboard screenshot for Dona Events, matching the small product preview in the supplied portfolio reference. Use a near-black interface, muted green sidebar, cards for Eventos criados 35.782, Participantes 1.2M, and Visualizacoes, plus a lime-green rising line chart. No browser chrome, device frame, hands, perspective distortion, watermark, or unrelated text. Landscape 16:10, crisp production UI, Portuguese labels.
```

Save the generated output as `/tmp/dona-events-dashboard-source.png` and inspect it for legibility and matching palette.

- [ ] **Step 6: Add deterministic post-processing**

Create `scripts/prepare-visual-assets.mjs`:

```js
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const [portraitInput, dashboardInput] = process.argv.slice(2);
if (!portraitInput || !dashboardInput) {
  throw new Error(
    'Usage: node scripts/prepare-visual-assets.mjs <portrait> <dashboard>',
  );
}

const { data, info } = await sharp(portraitInput)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let offset = 0; offset < data.length; offset += info.channels) {
  const red = data[offset];
  const green = data[offset + 1];
  const blue = data[offset + 2];
  const originalAlpha = data[offset + 3];
  const distance = Math.hypot(red - 255, green, blue - 255);
  const matte = Math.max(0, Math.min(1, (distance - 24) / 72));

  data[offset + 3] = Math.round(originalAlpha * matte);
  if (matte < 1) {
    const spill = Math.max(0, Math.min(red, blue) - green);
    data[offset] = Math.max(0, red - spill * (1 - matte));
    data[offset + 2] = Math.max(0, blue - spill * (1 - matte));
  }
}

await sharp(data, {
  raw: {
    width: info.width,
    height: info.height,
    channels: info.channels,
  },
})
  .resize(1024, 1240, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
    withoutEnlargement: true,
  })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(
    fileURLToPath(
      new URL('../src/assets/eduardo-portrait.png', import.meta.url),
    ),
  );

await sharp(dashboardInput)
  .resize(1120, 700, { fit: 'cover', position: 'centre' })
  .webp({ quality: 86, effort: 6 })
  .toFile(
    fileURLToPath(
      new URL('../src/assets/dona-events-dashboard.webp', import.meta.url),
    ),
  );
```

- [ ] **Step 7: Build and verify the final assets**

Run:

```bash
node scripts/prepare-visual-assets.mjs /tmp/eduardo-portrait-chroma.png /tmp/dona-events-dashboard-source.png
node --test scripts/visual-assets.test.mjs
```

Expected: 2 tests PASS. Inspect `src/assets/eduardo-portrait.png` and reject any visible magenta halo before proceeding.

- [ ] **Step 8: Commit the asset boundary**

```bash
git add package.json package-lock.json scripts/prepare-visual-assets.mjs scripts/visual-assets.test.mjs src/assets/eduardo-portrait.png src/assets/dona-events-dashboard.webp
git commit -m "feat: add production portfolio assets"
```

---

### Task 2: Make Navigation Stable and Section-Aware

**Files:**
- Modify: `src/site-contract.ts:16-47`
- Create: `src/components/navigation/useActiveSection.ts`
- Create: `src/components/navigation/useActiveSection.test.tsx`
- Modify: `src/components/SiteHeader.tsx:16-56`
- Modify: `src/components/navigation/navigation-types.ts`
- Modify: `src/components/navigation/DesktopSectionRail.tsx:3-29`
- Modify: `src/components/navigation/MobileSiteHeader.tsx:1-68`
- Modify: `src/components/SiteHeader.test.tsx`
- Modify: `src/features/home/HomeHero.tsx:31-55`

**Interfaces:**
- Consumes: stable IDs from `HOME_NAVIGATION_ANCHORS`.
- Produces: `useActiveSection(ids, enabled): string`; navigation links expose `aria-current="location"` for the active section.

- [ ] **Step 1: Write the failing active-section test**

Create `src/components/navigation/useActiveSection.test.tsx`:

```tsx
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useActiveSection } from './useActiveSection';

const ids = ['home', 'work'] as const;
let callback: IntersectionObserverCallback | undefined;
let disconnect: ReturnType<typeof vi.fn>;

function Probe() {
  const activeId = useActiveSection(ids, true);
  return (
    <>
      <section id="home" />
      <section id="work" />
      <output>{activeId}</output>
    </>
  );
}

beforeEach(() => {
  disconnect = vi.fn();
  class ObserverMock implements IntersectionObserver {
    constructor(next: IntersectionObserverCallback) {
      callback = next;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = disconnect;
    root = null;
    rootMargin = '';
    thresholds = [];
    takeRecords = () => [];
  }
  vi.stubGlobal('IntersectionObserver', ObserverMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it('tracks the strongest visible section and disconnects', () => {
  const view = render(<Probe />);
  expect(screen.getByText('home')).toBeVisible();

  act(() => {
    callback?.(
      [
        {
          target: document.getElementById('work')!,
          isIntersecting: true,
          intersectionRatio: 0.75,
        } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );
  });

  expect(screen.getByText('work')).toBeVisible();
  view.unmount();
  expect(disconnect).toHaveBeenCalledOnce();
});
```

- [ ] **Step 2: Run the hook test and verify RED**

Run:

```bash
npm test -- src/components/navigation/useActiveSection.test.tsx
```

Expected: FAIL because `useActiveSection.ts` does not exist.

- [ ] **Step 3: Add stable hero navigation IDs**

Extend `SITE_ANCHORS.home` with `hero: 'home'`. Add:

```ts
export const HOME_NAVIGATION_ANCHORS = [
  SITE_ANCHORS.home.hero,
  SITE_ANCHORS.home.work,
  SITE_ANCHORS.home.expertise,
  SITE_ANCHORS.home.career,
  SITE_ANCHORS.home.contact,
] as const;
```

Set `id={SITE_ANCHORS.home.hero}` on the `HomeHero` section. Use `#home` for the first home navigation item instead of `#main-content`; keep the skip link targeting `#main-content`.

- [ ] **Step 4: Implement the observer hook**

Create `src/components/navigation/useActiveSection.ts`:

```ts
import { useEffect, useState } from 'react';

export function useActiveSection(
  ids: readonly string[],
  enabled: boolean,
): string {
  const [activeId, setActiveId] = useState(ids[0] ?? '');
  const idKey = ids.join('\u0000');

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return;

    const visible = new Map<string, number>();
    const elements = idKey
      .split('\u0000')
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) visible.set(id, entry.intersectionRatio);
          else visible.delete(id);
        }
        const next = [...visible.entries()].sort(
          ([, left], [, right]) => right - left,
        )[0]?.[0];
        if (next) setActiveId(next);
      },
      {
        rootMargin: '-18% 0px -58% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [enabled, idKey]);

  return activeId;
}
```

- [ ] **Step 5: Pass active state through both navigation surfaces**

In `SiteHeader`, call:

```ts
const activeId = useActiveSection(HOME_NAVIGATION_ANCHORS, isHome);
```

Extend `SectionNavigationItem` with `sectionId: string`, pass `activeId` to both navigation components, and render:

```tsx
aria-current={item.sectionId === activeId ? 'location' : undefined}
```

Replace the mobile `×` and `☰` glyphs with `XIcon` and `ListIcon` from `@phosphor-icons/react`, each `size={22}` and `aria-hidden="true"`.

- [ ] **Step 6: Extend navigation tests**

In `SiteHeader.test.tsx`, mock `IntersectionObserver`, add elements with IDs `home` and `work`, emit the `work` entry, and assert the desktop `Trabalhos selecionados` link has `aria-current="location"`. Preserve existing Escape and focus assertions for the mobile toggle.

- [ ] **Step 7: Run navigation tests and verify GREEN**

Run:

```bash
npm test -- src/components/navigation/useActiveSection.test.tsx src/components/SiteHeader.test.tsx src/components/LanguageSwitcher.test.tsx
```

Expected: all navigation tests PASS.

- [ ] **Step 8: Commit**

```bash
git add src/site-contract.ts src/components/SiteHeader.tsx src/components/SiteHeader.test.tsx src/components/navigation src/features/home/HomeHero.tsx
git commit -m "feat: stabilize responsive section navigation"
```

---

### Task 3: Rebuild the Hero Around the Reference Composition

**Files:**
- Modify: `src/content/schema.ts:12-20`
- Modify: `src/content/pt-BR.ts:11-20`
- Modify: `src/content/en.ts:11-20`
- Modify: `src/content/content.test.ts`
- Create: `src/features/home/CapabilityStrip.tsx`
- Modify: `src/features/home/HomeHero.tsx`
- Modify: `src/features/home/HomeHero.test.tsx`
- Modify: `src/features/home/HeroPortrait.tsx`
- Modify: `src/features/home/HeroPortrait.test.tsx`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/layout.css`
- Modify: `src/styles/components.css`

**Interfaces:**
- Consumes: `PortfolioContent.hero.capabilities`, transparent portrait asset, existing CTA destinations.
- Produces: semantic hero with content, portrait, canvas host, and capability strip; no square portrait frame.

- [ ] **Step 1: Write failing content and hero tests**

Extend `PortfolioContent.hero` with:

```ts
capabilities: Array<{
  id: 'distributed' | 'mobile' | 'ai' | 'observability';
  label: string;
}>;
```

Before implementing content, add assertions that both locales expose exactly four IDs in this order. Extend `HomeHero.test.tsx` to assert the Portuguese hero contains `Sistemas distribuídos`, `Mobile`, `IA aplicada`, and `Observabilidade`, plus three CTA links inside one `.action-cluster`.

- [ ] **Step 2: Verify RED**

Run:

```bash
npm test -- src/content/content.test.ts src/features/home/HomeHero.test.tsx
```

Expected: FAIL because `capabilities` is absent and `CapabilityStrip` is not rendered.

- [ ] **Step 3: Add localized capability content**

Add to Portuguese:

```ts
capabilities: [
  { id: 'distributed', label: 'Sistemas distribuídos' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'ai', label: 'IA aplicada' },
  { id: 'observability', label: 'Observabilidade' },
],
```

Add to English:

```ts
capabilities: [
  { id: 'distributed', label: 'Distributed systems' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'ai', label: 'Applied AI' },
  { id: 'observability', label: 'Observability' },
],
```

- [ ] **Step 4: Create the capability strip**

Create `CapabilityStrip.tsx`:

```tsx
import {
  BrainIcon,
  ChartBarIcon,
  DeviceMobileIcon,
  GraphIcon,
} from '@phosphor-icons/react';
import type { PortfolioContent } from '../../content';

const iconByCapability = {
  distributed: GraphIcon,
  mobile: DeviceMobileIcon,
  ai: BrainIcon,
  observability: ChartBarIcon,
} as const;

export function CapabilityStrip({
  items,
}: {
  items: PortfolioContent['hero']['capabilities'];
}) {
  return (
    <ul className="capability-strip">
      {items.map((item) => {
        const Icon = iconByCapability[item.id];
        return (
          <li className="capability-strip__item" key={item.id}>
            <Icon aria-hidden="true" size={34} weight="light" />
            <span>{item.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
```

Keep the list accessible through its visible text and keep each icon decorative.

- [ ] **Step 5: Replace hero action and portrait markup**

In `HomeHero.tsx`, render `ArrowRightIcon`, `LinkedinLogoIcon`, and `FileTextIcon` inside the three existing links without changing accessible names or destinations. Render `CapabilityStrip` after the content and visual columns.

In `HeroPortrait.tsx`, import `eduardo-portrait.png`, keep the load/error state machine and intrinsic dimensions, and reduce markup to:

```tsx
<figure className="hero-portrait" data-image-state={imageState}>
  <img
    src={portraitUrl}
    alt={alt}
    width={1024}
    height={1240}
    loading={priority ? 'eager' : 'lazy'}
    fetchPriority={priority ? 'high' : 'auto'}
    hidden={failed}
    onLoad={() => setImageState('ready')}
    onError={() => setImageState('fallback')}
  />
  <span className="hero-portrait__fallback" aria-hidden="true">EL</span>
</figure>
```

Remove the square frame, scanline, beach filters, and `EL-01` caption.

- [ ] **Step 6: Implement reference-aligned hero tokens and geometry**

Use these governing values:

```css
:root {
  --rail-width: 8.25rem;
  --container: 81rem;
  --space-section: clamp(4rem, 7vw, 6.5rem);
  --hero-name: clamp(5.25rem, 8.2vw, 7.7rem);
  --hero-role: clamp(1.25rem, 1.8vw, 1.65rem);
}

.home-hero {
  min-height: 50.5rem;
  grid-template-columns: minmax(27rem, 0.86fr) minmax(31rem, 1.14fr);
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 1.75rem clamp(2rem, 4vw, 4.75rem);
  padding-block: clamp(4rem, 8vh, 6rem) 2rem;
}

.home-hero__name {
  max-width: 8.5ch;
  font-size: var(--hero-name);
  line-height: 0.84;
}

.home-hero__role {
  margin-top: 0.85rem;
  font-family: var(--font-mono);
  font-size: var(--hero-role);
  font-weight: 500;
  line-height: 1.15;
  text-transform: none;
}

.hero-portrait {
  width: min(100%, 39rem);
  margin: 0 auto;
  filter: drop-shadow(0 0 2.5rem rgb(168 255 62 / 14%));
}

.hero-portrait img {
  width: 100%;
  height: auto;
  mask-image: linear-gradient(to bottom, black 0 82%, transparent 100%);
}

.capability-strip {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--color-line);
  padding-top: 1.25rem;
}
```

Add the reference background using layered radial and linear gradients on `body`; preserve the low-opacity grid and keep all decorative layers pointer-inert.

- [ ] **Step 7: Run hero tests and build**

Run:

```bash
npm test -- src/content/content.test.ts src/features/home/HomeHero.test.tsx src/features/home/HeroPortrait.test.tsx
npm run typecheck
npm run build
```

Expected: tests PASS, typecheck exits 0, build exits 0, portrait and icon assets resolve.

- [ ] **Step 8: Commit**

```bash
git add src/content src/features/home src/styles
git commit -m "feat: rebuild the portfolio hero"
```

---

### Task 4: Turn the Particle Overlay Into a Dissolve Field

**Files:**
- Modify: `src/experience/particles/particle-layout.ts`
- Modify: `src/experience/particles/particle-layout.test.ts`
- Modify: `src/experience/particles/NeuralParticleField.tsx`
- Modify: `src/experience/particles/particle-shaders.ts`
- Modify: `src/experience/particles/particle-shaders.test.ts`
- Modify: `src/styles/components.css`
- Modify: `e2e/portfolio.spec.ts`

**Interfaces:**
- Consumes: existing quality profile particle count and one Canvas.
- Produces: deterministic right-biased particle positions plus sparse connection segments in the same scene.

- [ ] **Step 1: Write failing particle-layout assertions**

Extend `ParticleLayout` expectations so `buildParticleLayout(120, 197)` returns:

```ts
expect(layout.positions).toHaveLength(360);
expect(layout.phases).toHaveLength(120);
expect(layout.sizes).toHaveLength(120);
expect(layout.connections.length).toBeGreaterThan(0);
expect(layout.connections.length % 6).toBe(0);
```

Also assert at least 70% of X positions are positive; this proves right-side bias instead of a centered ring.

- [ ] **Step 2: Verify RED**

Run:

```bash
npm test -- src/experience/particles/particle-layout.test.ts
```

Expected: FAIL because `connections` does not exist and the current ring is not right-biased.

- [ ] **Step 3: Generate biased points and sparse connections**

Replace `particle-layout.ts` with the existing deterministic PRNG plus this complete layout contract:

```ts
export interface ParticleLayout {
  positions: Float32Array;
  phases: Float32Array;
  sizes: Float32Array;
  connections: Float32Array;
}

export function buildParticleLayout(count: number, seed = 197): ParticleLayout {
  if (count <= 0) {
    return {
      positions: new Float32Array(),
      phases: new Float32Array(),
      sizes: new Float32Array(),
      connections: new Float32Array(),
    };
  }

  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const sizes = new Float32Array(count);
  const connectionValues: number[] = [];
  const random = mulberry32(seed);

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    const spread = Math.pow(random(), 0.72);
    positions[offset] = -0.6 + spread * 7.2;
    positions[offset + 1] = (random() - 0.5) * (5.2 + spread * 2.1);
    positions[offset + 2] = (random() - 0.5) * 3.6;
    phases[index] = random() * Math.PI * 2;
    sizes[index] = 0.55 + random() * 1.65;

    if (index === 0 || index % 6 !== 0) continue;

    let nearestIndex = -1;
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (
      let candidate = Math.max(0, index - 12);
      candidate < index;
      candidate += 1
    ) {
      const candidateOffset = candidate * 3;
      const distance = Math.hypot(
        positions[offset] - positions[candidateOffset],
        positions[offset + 1] - positions[candidateOffset + 1],
        positions[offset + 2] - positions[candidateOffset + 2],
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = candidate;
      }
    }

    if (nearestIndex >= 0 && nearestDistance <= 4.5) {
      const nearestOffset = nearestIndex * 3;
      connectionValues.push(
        positions[offset],
        positions[offset + 1],
        positions[offset + 2],
        positions[nearestOffset],
        positions[nearestOffset + 1],
        positions[nearestOffset + 2],
      );
    }
  }

  return {
    positions,
    phases,
    sizes,
    connections: new Float32Array(connectionValues),
  };
}
```

Preserve the existing `mulberry32` helper unchanged above this function.

- [ ] **Step 4: Render connections without a second canvas**

In `NeuralParticleField`, render the current `<points>` plus one `<lineSegments>` sibling inside a fragment. The line geometry consumes `layout.connections`; use `lineBasicMaterial` with `color="#8fdc35"`, `transparent`, `opacity={0.16}`, and `depthWrite={false}`. Keep the only `useFrame` mutation on the shader uniform.

- [ ] **Step 5: Slow and soften the shader**

Keep the existing attribute interface. Change motion to `uTime * 0.18` vertical drift and `uTime * 0.08` lateral drift. Reduce fragment alpha multiplier to `0.72`; keep circular point falloff.

- [ ] **Step 6: Bind canvas geometry to the portrait dissolve**

Use:

```css
.particle-experience.home-hero__particles {
  inset: -10% -12% -4% 38%;
  z-index: 3;
  overflow: hidden;
  opacity: 0.78;
  mask-image: linear-gradient(
    to right,
    transparent 0,
    rgb(0 0 0 / 35%) 12%,
    black 34%,
    black 88%,
    transparent 100%
  );
}
```

Apply a complementary right-edge mask to the portrait so the canvas emerges from the subject instead of floating over a square image.

- [ ] **Step 7: Verify particles and one-canvas resilience**

Run:

```bash
npm test -- src/experience/particles/particle-layout.test.ts src/experience/particles/particle-shaders.test.ts src/experience/ParticleExperience.test.tsx
npm run e2e -- --grep "particle|WebGL|canvas"
```

Expected: particle unit tests PASS; browser tests observe zero or one canvas and preserve CTAs without WebGL.

- [ ] **Step 8: Commit**

```bash
git add src/experience src/styles/components.css e2e/portfolio.spec.ts
git commit -m "feat: integrate the portrait dissolve field"
```

---

### Task 5: Compact the Remaining Sections and Add One-Shot Reveals

**Files:**
- Create: `src/components/useRevealOnView.ts`
- Create: `src/components/useRevealOnView.test.tsx`
- Modify: `src/features/projects/FeaturedProject.tsx`
- Modify: `src/features/expertise/ExpertiseSection.tsx`
- Modify: `src/features/career/CareerTimeline.tsx`
- Modify: `src/features/contact/ContactSection.tsx`
- Modify: `src/styles/layout.css`
- Modify: `src/styles/components.css`

**Interfaces:**
- Consumes: existing localized content, `dona-events-dashboard.webp`, section refs.
- Produces: `useRevealOnView<T>(): { ref: RefObject<T | null>; revealed: boolean }`; dense project, expertise, career, and contact sections.

- [ ] **Step 1: Write failing reveal tests**

Create `src/components/useRevealOnView.test.tsx`:

```tsx
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useRevealOnView } from './useRevealOnView';

let callback: IntersectionObserverCallback | undefined;
let observer: IntersectionObserver;
let disconnect: ReturnType<typeof vi.fn>;

function Probe() {
  const { ref, revealed } = useRevealOnView<HTMLDivElement>();
  return <div ref={ref}>{revealed ? 'revealed' : 'hidden'}</div>;
}

function mediaQuery(matches: boolean): MediaQueryList {
  return {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
}

beforeEach(() => {
  disconnect = vi.fn();
  vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery(false)));

  class ObserverMock implements IntersectionObserver {
    constructor(next: IntersectionObserverCallback) {
      callback = next;
      observer = this;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = disconnect;
    root = null;
    rootMargin = '';
    thresholds = [];
    takeRecords = () => [];
  }
  vi.stubGlobal('IntersectionObserver', ObserverMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it('reveals once when the target intersects', () => {
  render(<Probe />);
  expect(screen.getByText('hidden')).toBeVisible();
  act(() =>
    callback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      observer,
    ),
  );
  expect(screen.getByText('revealed')).toBeVisible();
  expect(disconnect).toHaveBeenCalledOnce();
});

it('starts revealed when reduced motion is requested', () => {
  vi.mocked(window.matchMedia).mockReturnValue(mediaQuery(true));
  render(<Probe />);
  expect(screen.getByText('revealed')).toBeVisible();
});

it('starts revealed when IntersectionObserver is unavailable', () => {
  vi.stubGlobal('IntersectionObserver', undefined);
  render(<Probe />);
  expect(screen.getByText('revealed')).toBeVisible();
});
```

- [ ] **Step 2: Verify RED**

Run:

```bash
npm test -- src/components/useRevealOnView.test.tsx
```

Expected: FAIL because the hook does not exist.

- [ ] **Step 3: Implement one-shot reveal**

Create `useRevealOnView.ts`:

```ts
import { useEffect, useRef, useState } from 'react';

function shouldRevealImmediately(): boolean {
  if (typeof window === 'undefined') return true;
  if (typeof IntersectionObserver === 'undefined') return true;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

export function useRevealOnView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(shouldRevealImmediately);

  useEffect(() => {
    if (revealed) return;
    const element = ref.current;
    if (!element) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setRevealed(true);
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [revealed]);

  return { ref, revealed };
}
```

- [ ] **Step 4: Rebuild FeaturedProject markup**

Import `dona-events-dashboard.webp`. Preserve the eyebrow and localized featured-work label, move the section `h2` into the card exactly once, and preserve the route. Render one `.feature-card` containing:

```tsx
<div className="feature-card__copy">
  <p className="feature-panel__role">{content.dona.role}</p>
  <h2 id={SITE_ANCHORS.home.workTitle}>{content.dona.title}</h2>
  <p className="metric">{content.donaCase.metric}</p>
  <p className="feature-panel__summary">{content.dona.summary}</p>
  <Link className="button button--primary" to={destination}>
    {content.dona.cta}
  </Link>
</div>
<figure className="feature-card__visual" aria-hidden="true">
  <img src={dashboardUrl} alt="" width={1120} height={700} loading="lazy" />
</figure>
```

- [ ] **Step 5: Apply reveal state to semantic sections**

Each section keeps its current semantic root. Attach its typed reveal ref and `data-revealed={revealed}`. Do not add wrapper divs that alter heading relationships.

- [ ] **Step 6: Compact section geometry**

Use these constraints:

```css
.feature-section,
.expertise-section,
.career-section,
.contact-section {
  padding-block: var(--space-section);
}

.feature-card {
  display: grid;
  grid-template-columns: minmax(18rem, 0.72fr) minmax(30rem, 1.28fr);
  gap: clamp(2rem, 4vw, 4rem);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  border: 1px solid var(--color-line);
  border-radius: 1.5rem;
  background: linear-gradient(135deg, rgb(7 16 9 / 94%), rgb(2 5 3 / 72%));
}

.metric {
  font-size: clamp(1.55rem, 2.2vw, 2.35rem);
  line-height: 1;
}

.expertise-card {
  min-height: 0;
  padding: clamp(1.25rem, 2.2vw, 2rem);
}

.expertise-card__index {
  margin-bottom: 2.25rem;
}

.timeline {
  margin-top: 3rem;
}

.timeline__item {
  padding: 1.5rem 0;
}

.contact-section {
  margin-bottom: 3rem;
  padding-block: clamp(4rem, 8vw, 7rem);
}
```

Add reveal transitions only to `[data-revealed]` content; use opacity and translateY, and let reduced-motion CSS force the final state.

- [ ] **Step 7: Run component tests and build**

Run:

```bash
npm test -- src/components/useRevealOnView.test.tsx src/features/home/HomePage.test.tsx
npm run typecheck
npm run build
```

Expected: tests PASS, typecheck exits 0, build resolves the lazy dashboard asset.

- [ ] **Step 8: Commit**

```bash
git add src/components/useRevealOnView.ts src/components/useRevealOnView.test.tsx src/features src/styles
git commit -m "feat: refine portfolio sections and motion"
```

---

### Task 6: Lock Responsive Geometry, Typography, and Menu Behavior

**Files:**
- Modify: `scripts/design-system-css.test.mjs`
- Modify: `src/styles/base.css`
- Modify: `src/styles/layout.css`
- Modify: `src/styles/components.css`
- Modify: `e2e/portfolio.spec.ts`

**Interfaces:**
- Consumes: semantic markup and tokens from Tasks 2-5.
- Produces: deterministic desktop rail, compact header, mobile menu, and no-overflow contracts at five viewports.

- [ ] **Step 1: Write failing CSS boundary tests**

Extend `scripts/design-system-css.test.mjs` to assert:

```js
assert.match(layoutCss, /@media\s*\(max-width:\s*1179px\)/);
assert.match(layoutCss, /@media\s*\(max-width:\s*767px\)/);
assert.doesNotMatch(layoutCss, /@media\s*\(max-width:\s*800px\)/);
assert.match(tokensCss, /--rail-width:\s*8\.25rem/);
assert.match(tokensCss, /--hero-name:\s*clamp\(5\.25rem, 8\.2vw, 7\.7rem\)/);
assert.doesNotMatch(componentsCss, /font-size:\s*clamp\(3\.5rem, 8vw, 8rem\)/);
```

Read `layout.css`, `tokens.css`, and `components.css` separately so each assertion targets its owner.

- [ ] **Step 2: Verify CSS RED**

Run:

```bash
node --test scripts/design-system-css.test.mjs
```

Expected: FAIL on the old 800 px breakpoint and oversized metric clamp.

- [ ] **Step 3: Write failing E2E geometry tests**

Add parameterized no-overflow coverage for widths `390`, `768`, `1024`, `1440`, and `1488`. At 1488 x 1058 assert:

```ts
const hero = await page.locator('.home-hero').boundingBox();
const project = await page.locator('#work').boundingBox();
const portrait = await page.locator('.hero-portrait').boundingBox();
const rail = await page.locator('.site-header').boundingBox();

expect(hero).not.toBeNull();
expect(project).not.toBeNull();
expect(portrait).not.toBeNull();
expect(rail).not.toBeNull();
expect(project!.y).toBeLessThan(1058);
expect(portrait!.x).toBeGreaterThan(700);
expect(rail!.width).toBeLessThanOrEqual(132);
```

At 1024 assert the desktop rail is hidden and compact header visible. At 390 open the menu, assert all links are visible, press Escape, and assert focus returns to the toggle.

- [ ] **Step 4: Verify E2E RED**

Run:

```bash
npm run e2e -- --grep "responsive|reference viewport|compact header"
```

Expected: FAIL because the rail remains active through 1100 px and project begins below the reference fold.

- [ ] **Step 5: Replace the breakpoint system**

Desktop rail rules have no media wrapper and apply from 1180 px. Add:

```css
@media (max-width: 1179px) {
  .site-main,
  .dona-page {
    padding-left: 0;
  }

  .site-header {
    position: sticky;
    inset: 0 auto auto 0;
    width: 100%;
    min-height: 4rem;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem clamp(1rem, 3vw, 2rem);
    border-right: 0;
    border-bottom: 1px solid var(--color-line);
  }

  .desktop-section-rail {
    display: none;
  }

  .mobile-site-header {
    display: contents;
  }
}

@media (max-width: 767px) {
  .home-hero,
  .feature-card,
  .expertise-grid,
  .contact-section {
    grid-template-columns: 1fr;
  }

  .capability-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

At 768-1179 px keep the hero in two columns only when both tracks remain at least 21rem; otherwise stack it. Ensure menu labels use `white-space: nowrap` on the desktop rail only and can wrap safely in the mobile panel.

- [ ] **Step 6: Normalize display sizes outside the hero**

Reduce Dona detail hero title to `clamp(4rem, 9vw, 8rem)` and section titles to `clamp(2.5rem, 4vw, 4.25rem)`. Remove viewport-driven `min-height` from expertise, career, contact, and Dona case content sections.

- [ ] **Step 7: Run responsive gates and full unit suite**

Run:

```bash
node --test scripts/design-system-css.test.mjs
npm run e2e -- --grep "responsive|reference viewport|compact header"
npm run test:run
```

Expected: CSS tests PASS; responsive E2E tests PASS at all five widths; unit and script suite has zero failures.

- [ ] **Step 8: Commit**

```bash
git add scripts/design-system-css.test.mjs src/styles e2e/portfolio.spec.ts
git commit -m "fix: lock portfolio responsive geometry"
```

---

### Task 7: Run Visual QA, Resilience Gates, and Production Verification

**Files:**
- Create: `design-qa.md`
- Modify as findings require: only files already named in Tasks 1-6
- Modify: `README.md` only if measured bundle sizes change

**Interfaces:**
- Consumes: approved reference, rendered `/pt-br`, automated checks.
- Produces: browser evidence, comparison history, `final result: passed`, production build evidence, and a local preview URL.

- [ ] **Step 1: Run the complete non-visual gate**

Run:

```bash
npm run check
npm run e2e
npm audit --omit=dev
```

Expected: `check` exits 0, all Playwright projects pass, and audit reports zero production vulnerabilities. Do not continue to visual acceptance with a failing gate.

- [ ] **Step 2: Start the local app for browser verification**

Run:

```bash
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

Expected: Vite remains running on `http://127.0.0.1:4173`.

- [ ] **Step 3: Capture the implementation in the in-app Browser**

Open `/pt-br` in the Codex in-app Browser, set the viewport to 1488 x 1058, wait for fonts and hero image, and capture `.superpowers/design-qa/portfolio-1488x1058.png`. Also capture 390 x 844 after opening and closing the menu once. Test project navigation, PT/EN switching, curriculum download link, keyboard focus, reduced motion, and the no-WebGL fallback. Check the browser console and record any error.

- [ ] **Step 4: Compare source and implementation together**

Create one comparison input containing both the approved reference and the 1488 x 1058 implementation screenshot. Inspect full composition plus focused hero, rail, CTA, portrait edge, capability strip, and first-project crops. Evaluate typography, spacing, tokens, image quality, icons, and copy.

- [ ] **Step 5: Write the first QA report**

Create `design-qa.md` with source path, implementation path, viewport, state, full-view evidence, focused evidence, prioritized findings, primary interactions, console status, comparison history, and `final result: blocked` whenever any P0-P2 remains.

- [ ] **Step 6: Fix and repeat until P0-P2 is empty**

For every iteration: add or update a failing automated assertion when the mismatch is structural, run it RED, apply the smallest fix, run it GREEN, capture the same viewport again, compare both images together, and append the evidence to the report. Do not loop on P3-only polish.

- [ ] **Step 7: Record final production evidence**

Run fresh:

```bash
npm run check
npm run e2e
npm run build
find dist/assets -maxdepth 1 -type f -print0 | xargs -0 -n1 sh -c 'printf "%s " "$0"; wc -c < "$0"'
gzip -c dist/assets/index-*.js | wc -c
gzip -c dist/assets/ParticleScene-*.js | wc -c
git status --short
```

Expected: every command exits 0; no test failures; app and particle chunks remain separated; only intended files are modified. Update README measured sizes only from this fresh output.

- [ ] **Step 8: Mark QA passed and commit the verified result**

Change the final report line to exactly:

```text
final result: passed
```

Then commit:

```bash
git add design-qa.md README.md package.json package-lock.json scripts src e2e
git commit -m "feat: deliver the reference-faithful portfolio"
```

- [ ] **Step 9: Keep preview running for handoff**

Confirm the current process still serves `/pt-br` and return the clickable local URL with the final verification summary. Do not claim completion if the preview, source screenshot, implementation screenshot, or combined comparison is unavailable.
