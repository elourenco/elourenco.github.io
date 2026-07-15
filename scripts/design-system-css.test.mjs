import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const baseCss = readFileSync(
  new URL('../src/styles/base.css', import.meta.url),
  'utf8',
);
const componentsCss = readFileSync(
  new URL('../src/styles/components.css', import.meta.url),
  'utf8',
);
const layoutCss = readFileSync(
  new URL('../src/styles/layout.css', import.meta.url),
  'utf8',
);
const tokensCss = readFileSync(
  new URL('../src/styles/tokens.css', import.meta.url),
  'utf8',
);

function rule(css, selector) {
  const matches = [
    ...css.matchAll(
      new RegExp(`${selector.replaceAll('.', '\\.')}\\s*\\{([^}]*)\\}`, 'g'),
    ),
  ];
  assert.ok(matches.length > 0, `Expected ${selector} rule`);
  return matches.map((match) => match[1]).join('\n');
}

test('keeps the display clamp on the hero name and the role secondary', () => {
  const name = rule(componentsCss, '.home-hero__name');
  const role = rule(componentsCss, '.home-hero__role');

  assert.doesNotMatch(
    componentsCss,
    /\.home-hero__title\s*{[^}]*font-size:\s*clamp\(4\.5rem, 9vw, 8\.5rem\)/,
  );
  assert.match(name, /max-width:\s*8\.5ch/);
  assert.match(name, /font-size:\s*var\(--hero-name\)/);
  assert.match(name, /transform:\s*scaleY\(1\.2\)/);
  assert.match(role, /font-size:\s*var\(--hero-role\)/);
  assert.match(role, /color:\s*var\(--color-signal\)/);
  assert.match(role, /margin-top:\s*3\.45rem/);
});

test('confines the particle dissolve to a softly faded right-side field', () => {
  const base = rule(componentsCss, '.particle-experience');
  const particles = rule(componentsCss, '.home-hero__particles');
  const portrait = rule(componentsCss, '.hero-portrait img');

  assert.match(base, /position:\s*absolute/);
  assert.match(base, /inset:\s*0/);
  assert.match(base, /pointer-events:\s*none/);
  assert.match(particles, /inset:\s*-8% 0 -2% 6%/);
  assert.match(particles, /overflow:\s*hidden/);
  assert.match(particles, /opacity:\s*0\.78/);
  assert.match(
    particles,
    /mask-image:\s*linear-gradient\(\s*to right,\s*transparent 0,\s*rgb\(0 0 0 \/ 35%\) 10%,\s*black 25%,\s*black 90%,\s*transparent 100%\s*\)/s,
  );
  assert.match(portrait, /black 0 48%/);
  assert.match(portrait, /transparent 78%/);
});

test('keeps the reference desktop hero and rail geometry structural', () => {
  const hero = rule(layoutCss, '.home-hero');
  const content = rule(layoutCss, '.home-hero__content');
  const desktopNav = rule(layoutCss, '.desktop-section-rail .site-header__nav');
  const actions = rule(componentsCss, '.home-hero .action-cluster');
  const disciplines = rule(componentsCss, '.home-hero__disciplines');

  assert.match(hero, /grid-template-rows:\s*45\.5rem auto/);
  assert.match(content, /margin-top:\s*9rem/);
  assert.match(desktopNav, /border-left:\s*1px solid var\(--color-line\)/);
  assert.match(actions, /flex-wrap:\s*nowrap/);
  assert.match(disciplines, /font-family:\s*var\(--font-mono\)/);
  assert.doesNotMatch(disciplines, /text-transform:\s*uppercase/);
});

test('owns the responsive shell at the approved breakpoint boundaries', () => {
  assert.match(layoutCss, /@media\s*\(max-width:\s*1179px\)/);
  assert.match(layoutCss, /@media\s*\(max-width:\s*767px\)/);
  assert.doesNotMatch(layoutCss, /@media\s*\(max-width:\s*800px\)/);
});

test('clips visual overflow locally without masking document overflow', () => {
  const body = rule(baseCss, 'body');
  const visual = rule(layoutCss, '.home-hero__visual');

  assert.doesNotMatch(body, /overflow-x:\s*hidden/);
  assert.match(visual, /overflow:\s*clip/);
});

test('keeps the fixed skip link out of document flow', () => {
  assert.doesNotMatch(layoutCss, /#root\s*>\s*a/);
  assert.match(componentsCss, /\.skip-link\s*{[^}]*position:\s*fixed/s);
});

test('bounds display typography in the correct CSS owners', () => {
  assert.match(tokensCss, /--rail-width:\s*8\.25rem/);
  assert.match(tokensCss, /--hero-name:\s*clamp\(5\.75rem, 8\.8vw, 8\.2rem\)/);
  assert.match(
    baseCss,
    /h2\s*{[^}]*font-size:\s*clamp\(2\.5rem, 4vw, 4\.25rem\)/s,
  );
  assert.doesNotMatch(
    componentsCss,
    /font-size:\s*clamp\(3\.5rem, 8vw, 8rem\)/,
  );
});
