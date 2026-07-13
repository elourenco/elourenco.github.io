import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { validateBuiltLinks } from './manifest-validation.mjs';

const distUrl = new URL('../dist/', import.meta.url);
const manifest = JSON.parse(
  await readFile(new URL('build-manifest.json', distUrl), 'utf8'),
);
const sitemap = await readFile(new URL('sitemap.xml', distUrl), 'utf8');
const fallback = await readFile(new URL('404.html', distUrl), 'utf8');

validateBuiltLinks(manifest);

for (const page of manifest.pages) {
  assert.match(
    sitemap,
    new RegExp(`<loc>https://elourenco\\.github\\.io${page.pathname}</loc>`),
  );
}
for (const asset of manifest.assets) {
  await access(new URL(asset.slice(1), distUrl));
}

assert.match(fallback, /encodeURIComponent\(location\.pathname\)/);
assert.match(fallback, /location\.replace/);
console.log('Built route, fragment, asset and external URL targets: OK');
