import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateLocalizedContent } from './manifest-validation.mjs';

const manifest = JSON.parse(
  await readFile(
    new URL('../dist/build-manifest.json', import.meta.url),
    'utf8',
  ),
);

assert.equal(manifest.schemaVersion, 1, 'unsupported build manifest schema');
validateLocalizedContent(manifest.content);
console.log('Built localized content parity, non-empty values and IDs: OK');
