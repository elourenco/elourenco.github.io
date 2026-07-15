# Task 4 report — Public bilingual Dona Events case

## Status

Implemented the public Dona Events case in English and Portuguese on the existing canonical routes. The page uses the shared header and locale switch, remains HTML-first, links to the public product, and limits its content to public product facts plus Eduardo's stated end-to-end ownership.

## Files

- Created `src/features/projects/DonaEventsPage.tsx`
- Created `src/features/projects/DonaEventsPage.test.tsx`
- Modified `src/content/schema.ts`
- Modified `src/content/en.ts`
- Modified `src/content/pt-BR.ts`
- Modified `src/app/routes.ts`, the existing route-composition owner consumed by `AppRouter`

## TDD evidence

### RED

Command:

```text
npm run test:run -- src/features/projects/DonaEventsPage.test.tsx
```

Result: expected failure. Vitest could not resolve `./DonaEventsPage` because the production page did not exist.

### GREEN

Command:

```text
npm run test:run -- src/features/projects && npm run typecheck
```

Result: exit 0; 1 test file passed, 2 tests passed; typecheck passed. Coverage renders both locales at their canonical path, checks the exact public role, 35k public metric, shared localized navigation, public external link, and absence of proprietary disclosure terms.

## Full verification

Command:

```text
git diff --check
npm run test:run && npm run typecheck && npm run lint && npm run build
```

Result: exit 0; 8 test files passed, 19 tests passed; typecheck and lint passed; Vite production build passed. Output JavaScript was 298.82 kB (94.84 kB gzip).

## Commit

`feat: add Dona Events portfolio case` (the commit containing this report)

## Self-review and concerns

- The case exposes only public capabilities: Dona AI image/content generation, invitations, guest management, real-time RSVP, notifications, digital gifts, Pix/card payments, and the public 35k+ event count.
- Ownership is stated only at the approved product/mobile/web/backend/infrastructure/AI scope. No providers, models, costs, latencies, private metrics, or internal diagrams are present.
- The product role is consistently `Creator & Principal Engineer` in both locales, avoiding ambiguity from translating a public professional title.
- Content is semantic HTML and does not depend on WebGL or external runtime data. The external product is a normal anchor and does not block rendering.
- `AppRouter.tsx` remains the provider shell. Route composition already lives in `src/app/routes.ts`, so the case replaced the placeholder there instead of duplicating routing authority.
- Styling remains intentionally minimal because the approved task sequence assigns the visual system to Task 7.
- Existing unrelated `.gitignore` changes and generated `dist/` files are excluded from this task commit.

## Review fix — route-aware header navigation

Architect's Nexus review identified that the Dona Events header used fragment-only links, so navigation targeted sections absent from the case page. `SiteHeader` now has an explicit `SiteHeaderProps` contract with a `RouteKey`: home preserves `#main-content`, `#expertise`, `#work`, `#career`, and `#contact`; Dona Events resolves the localized home with `toLocalePath(content.locale, 'home')` and appends each section fragment.

### TDD evidence

- RED: `npm run test:run -- src/features/projects/DonaEventsPage.test.tsx` exited 1 with 2 expected failures: English Home received `#main-content` instead of `/en`, and Portuguese Início received `#main-content` instead of `/pt-br`.
- GREEN: `npm run test:run -- src/features/projects/DonaEventsPage.test.tsx src/features/home/HomePage.test.tsx` exited 0; 2 files and 4 tests passed. The case tests assert exact brand and primary-navigation hrefs for both locales; existing homepage assertions continue to require fragment-only hrefs.
- Full verification: `git diff --check && npm run test:run && npm run typecheck && npm run lint && npm run build` exited 0; 8 files and 19 tests passed, typecheck and lint passed, and the Vite production build completed with 298.87 kB JavaScript (94.87 kB gzip).

### Fix commit

`fix: make site header route-aware` (the commit containing this report)

### Concerns

- This uses normal anchors intentionally because the target includes fragments on another localized document route; there is no new runtime state, async work, or throughput-sensitive path.
- Route generation remains centralized in `toLocalePath`; no locale path is hardcoded in production code.
