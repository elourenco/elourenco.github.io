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
  assert.match(role, /font-size:\s*var\(--hero-role\)/);
  assert.match(role, /color:\s*var\(--color-signal\)/);
});

test('confines the particle dissolve to a softly faded right-side field', () => {
  const base = rule(componentsCss, '.particle-experience');
  const particles = rule(componentsCss, '.home-hero__particles');

  assert.match(base, /position:\s*absolute/);
  assert.match(base, /inset:\s*0/);
  assert.match(base, /pointer-events:\s*none/);
  assert.match(particles, /inset:\s*-10% -12% -4% 38%/);
  assert.match(particles, /overflow:\s*hidden/);
  assert.match(particles, /opacity:\s*0\.78/);
  assert.match(
    particles,
    /mask-image:\s*linear-gradient\(\s*to right,\s*transparent 0,\s*rgb\(0 0 0 \/ 35%\) 12%,\s*black 34%,\s*black 88%,\s*transparent 100%\s*\)/s,
  );
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

test('bounds display typography in the correct CSS owners', () => {
  assert.match(tokensCss, /--rail-width:\s*8\.25rem/);
  assert.match(tokensCss, /--hero-name:\s*clamp\(5\.25rem, 8\.2vw, 7\.7rem\)/);
  assert.match(
    baseCss,
    /h2\s*{[^}]*font-size:\s*clamp\(2\.5rem, 4vw, 4\.25rem\)/s,
  );
  assert.doesNotMatch(
    componentsCss,
    /font-size:\s*clamp\(3\.5rem, 8vw, 8rem\)/,
  );
});
