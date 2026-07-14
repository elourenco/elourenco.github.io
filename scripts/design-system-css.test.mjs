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
