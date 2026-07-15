import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { gzipSync } from 'node:zlib';

const dist = new URL('../dist/', import.meta.url);
const assets = new URL('./assets/', dist);
const CORRECTED_INITIAL_JS_BUDGET_BYTES = 106_000;

function assetsWithPrefix(prefix) {
  return readdirSync(assets).filter(
    (file) => file.startsWith(prefix) && file.endsWith('.js'),
  );
}

function oneAsset(prefix) {
  const matches = assetsWithPrefix(prefix);
  assert.equal(matches.length, 1, `Expected one ${prefix} JavaScript asset`);
  return matches[0];
}

test('keeps Three.js outside the production entry dependency graph', () => {
  const html = readFileSync(new URL('./index.html', dist), 'utf8');
  const entryName = oneAsset('index-');
  const particleName = oneAsset('ParticleScene-');
  const vendorNames = assetsWithPrefix('three-vendor-');
  const entry = readFileSync(new URL(`./assets/${entryName}`, dist), 'utf8');
  const particle = readFileSync(
    new URL(`./assets/${particleName}`, dist),
    'utf8',
  );

  assert.doesNotMatch(html, /three-vendor-[^"']+\.js/);
  const initialAssets = [
    ...html.matchAll(
      /<(?:script|link)[^>]+(?:src|href)="\/assets\/([^"]+\.js)"/g,
    ),
  ].map((match) => match[1]);
  const uniqueInitialAssets = [...new Set(initialAssets)];
  const initialGzipBytes = uniqueInitialAssets.reduce(
    (total, asset) =>
      total +
      gzipSync(readFileSync(new URL(`./assets/${asset}`, dist))).byteLength,
    0,
  );
  assert.ok(
    uniqueInitialAssets.every(
      (asset) =>
        !asset.startsWith('ParticleScene-') &&
        !asset.startsWith('three-vendor-'),
    ),
    `Heavy dynamic assets leaked into initial HTML: ${uniqueInitialAssets.join(', ')}`,
  );
  assert.doesNotMatch(entry, /import\s*\{[^}]*\}\s*from["']\.\/three-vendor-/);
  assert.match(entry, new RegExp(`ParticleScene-[^"']+\\.js`));
  if (vendorNames.length === 1) {
    assert.match(particle, new RegExp(`from["']\\./${vendorNames[0]}`));
  } else {
    assert.equal(vendorNames.length, 0);
    assert.ok(
      Buffer.byteLength(particle) > 500_000,
      'Expected the dynamically imported ParticleScene chunk to own Three.js',
    );
  }
  assert.ok(
    initialGzipBytes <= CORRECTED_INITIAL_JS_BUDGET_BYTES,
    `Critical initial JS gzip ${initialGzipBytes} B exceeds ${CORRECTED_INITIAL_JS_BUDGET_BYTES} B`,
  );
});
