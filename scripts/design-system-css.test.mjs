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

function rule(css, selector) {
  const matches = [
    ...css.matchAll(
      new RegExp(`${selector.replaceAll('.', '\\.')}\\s*\\{([^}]*)\\}`, 'g'),
    ),
  ];
  assert.ok(matches.length > 0, `Expected ${selector} rule`);
  return matches.map((match) => match[1]).join('\n');
}

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
