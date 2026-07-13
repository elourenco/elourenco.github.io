import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const canonicalRoutes = [
  '/en',
  '/en/projects/dona-events',
  '/pt-br',
  '/pt-br/projetos/dona-events',
];
const sitemap = await readFile(
  new URL('../dist/sitemap.xml', import.meta.url),
  'utf8',
);
const fallback = await readFile(
  new URL('../dist/404.html', import.meta.url),
  'utf8',
);
const assetNames = await (
  await import('node:fs/promises')
).readdir(new URL('../dist/assets/', import.meta.url));
const bundle = await Promise.all(
  assetNames
    .filter((name) => name.endsWith('.js'))
    .map((name) =>
      readFile(new URL(`../dist/assets/${name}`, import.meta.url), 'utf8'),
    ),
);

for (const route of canonicalRoutes) {
  assert.match(
    sitemap,
    new RegExp(`<loc>https://elourenco\\.github\\.io${route}</loc>`),
  );
  assert.ok(
    bundle.some((source) => source.includes(route)),
    `built route missing: ${route}`,
  );
}
for (const publicUrl of [
  'https://www.linkedin.com/in/dudulourenco',
  'https://github.com/elourenco',
  'https://dona.events',
]) {
  assert.ok(
    bundle.some((source) => source.includes(publicUrl)),
    `public URL missing: ${publicUrl}`,
  );
}
assert.match(fallback, /encodeURIComponent\(location\.pathname\)/);
assert.match(fallback, /location\.replace/);
console.log('Built routes and required public URLs: OK');
