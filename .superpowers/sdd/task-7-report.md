# Task 7 — Cosmic Realism visual system

## Status

Implemented the approved Cosmic Realism presentation over the Task 3 semantic
surface. The home page remains HTML-first and layers restrained glass, metal,
cyan telemetry, and the Task 6 scene behind readable content.

## Visual and responsive decisions

- Added centralized color, typography, spacing, radius, focus, container, and
  z-index tokens in `src/styles/tokens.css`.
- Added a dark/cyan/metal/glass system with deliberately restrained glow and no
  gamer-style chrome.
- Restored the approved information sequence: hero, featured work, expertise,
  career, contact.
- Desktop uses layered two-column hero/project/contact compositions and a
  three-column expertise system map. Content remains above the fixed canvas.
- At 800px the document becomes linear, the canvas is subdued to 42% opacity,
  and the technical grid backdrop becomes a low-opacity sticky scene layer.
- At 420px controls stack, containers retain 10px minimum side gutters at the
  320px acceptance width, and long content can wrap without forcing horizontal
  overflow.
- Interactive links/buttons have a 44px minimum target and a high-contrast cyan
  focus ring. Long-form copy is capped at approximately 65 characters.
- `prefers-reduced-motion` disables smooth scrolling, short-circuits
  nonessential transitions/animations, removes hover translation, and hides the
  portrait scanline.
- Removed the remaining Tailwind directives from `src`; `rg -i tailwind src`
  returns no matches.

## Profile portrait and asset

- Source: `/Users/elourenco/Documents/DOCS-Eduardo/selfAnimaBeachJPEG.jpg`.
- Derivative: `src/assets/eduardo-profile.jpg`.
- Mechanical optimization: macOS `sips`, JPEG quality 78, no crop or resize.
- Intrinsic dimensions/aspect: 752 x 752, 1:1 (preserved).
- Derivative size: 247,511 bytes.
- `ProfilePortrait` renders intrinsic width/height, lazy loading by default,
  optional priority/eager loading for the hero only, localized hero alt text,
  and a CSS identity fallback after an image error.
- Holographic treatment uses a technical clipped frame, restrained cyan filter,
  scanline, local fallback initials, and meaningful identity caption.

## TDD evidence

### RED

Command:

```text
npm run test:run -- src/components/ProfilePortrait.test.tsx
```

Result: failed at import resolution because `./ProfilePortrait` did not exist.
This verified that the new portrait contract was absent before production code.

### GREEN

The component then implemented intrinsic dimensions, default lazy/priority eager
loading, and failure fallback. The focused suite passes all 3 tests. The complete
suite passes 12 test files / 32 tests.

## Verification commands and results

```text
npm run test:run
```

Pass: 12 files, 32 tests.

```text
npm run typecheck
npm run lint
npm run build
```

Pass: all exit 0. Vite emits the pre-existing advisory that the Three.js vendor
chunk is above 500 kB; it does not fail the build.

```text
rg -n -i 'tailwind' src
```

Pass: no matches.

## Visual self-review

- Copy/order: matches the approved home information architecture.
- Container model: layered open page with selective glass panels; no generic
  card grid outside the system-map capability family.
- Typography: fluid display scale, deliberate control typography, 65ch body
  measure, responsive wrapping.
- Palette/material: space black, petroleum blue, metallic muted text, cold cyan,
  translucent glass, restrained bloom-like shadows.
- Portrait: intrinsic square frame, stable layout, localized alt, local fallback.
- Responsive/motion: CSS breakpoints cover desktop, linear mobile, 320px gutters,
  44px targets, subdued scene, and reduced-motion overrides.

## Commit

`feat: apply responsive Cosmic Realism visual system`

Commit hash is recorded after commit creation.

## Concerns

- Automated screenshot/browser comparison could not run in this worker because
  the in-app browser was unavailable and the Playwright CLI fallback could not
  establish a session. The root controller will perform visual QA after handoff.
- Vite still reports the Three.js vendor chunk above 500 kB. `AdaptiveCanvas`
  remains lazy, so this is a bundle-budget follow-up rather than a Task 7 blocker.
- The legacy, unimported JavaScript component tree still contains utility-style
  class strings. No Tailwind directives or `tailwind` references remain under
  `src`, and the active Vite entrypoint imports only the new global CSS system.
