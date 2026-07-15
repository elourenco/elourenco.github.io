import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const css = readFileSync(
  new URL('../src/styles/components.css', import.meta.url),
  'utf8',
);

function rule(selector) {
  const matches = [
    ...css.matchAll(
      new RegExp(`${selector.replaceAll('.', '\\.')}\\s*\\{([^}]*)\\}`, 'g'),
    ),
  ];
  assert.ok(matches.length > 0, `Expected ${selector} rule`);
  return matches.map((match) => match[1]).join('\n');
}

test('keeps the display clamp on the hero name and the role secondary', () => {
  const name = rule('.home-hero__name');
  const role = rule('.home-hero__role');

  assert.doesNotMatch(
    css,
    /\.home-hero__title\s*{[^}]*font-size:\s*clamp\(4\.5rem, 9vw, 8\.5rem\)/,
  );
  assert.match(name, /max-width:\s*9ch/);
  assert.match(name, /font-size:\s*clamp\(4\.5rem, 9vw, 8\.5rem\)/);
  assert.match(role, /font-size:\s*clamp\(1\.75rem,/);
  assert.match(role, /color:\s*var\(--color-signal\)/);
});

test('confines the particle dissolve to a softly faded right-side field', () => {
  const base = rule('.particle-experience');
  const particles = rule('.home-hero__particles');

  assert.match(base, /position:\s*absolute/);
  assert.match(base, /inset:\s*0/);
  assert.match(base, /pointer-events:\s*none/);
  assert.match(particles, /inset:\s*-8% 0/);
  assert.match(particles, /left:\s*42%/);
  assert.match(particles, /overflow:\s*hidden/);
  assert.match(particles, /opacity:\s*0\.58/);
  assert.match(
    particles,
    /mask-image:\s*linear-gradient\(\s*to right,\s*transparent 0,\s*black 24%,\s*black 86%,\s*transparent 100%\s*\)/s,
  );
});
