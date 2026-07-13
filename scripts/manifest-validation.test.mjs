import assert from 'node:assert/strict';
import test from 'node:test';
import {
  validateBuiltLinks,
  validateLocalizedContent,
} from './manifest-validation.mjs';

const content = (locale) => ({
  locale,
  hero: { title: locale === 'en' ? 'Engineer' : 'Engenheiro' },
  expertise: [{ id: 'architecture', title: 'Architecture' }],
});

const validManifest = {
  content: { en: content('en'), 'pt-BR': content('pt-BR') },
  pages: [
    {
      pathname: '/en',
      anchors: ['main-content', 'work'],
      internalLinks: ['#work', '/en/projects/dona-events'],
      externalLinks: ['https://example.com/profile'],
    },
    {
      pathname: '/en/projects/dona-events',
      anchors: ['main-content'],
      internalLinks: ['/en#work'],
      externalLinks: [],
    },
  ],
  assets: ['/cv.pdf'],
};

test('rejects a built manifest with a route that does not exist', () => {
  const broken = structuredClone(validManifest);
  broken.pages[0].internalLinks.push('/en/missing');
  assert.throws(() => validateBuiltLinks(broken), /missing route or asset/);
});

test('rejects a built manifest with a fragment absent from its destination', () => {
  const broken = structuredClone(validManifest);
  broken.pages[0].internalLinks.push('/en/projects/dona-events#work');
  assert.throws(() => validateBuiltLinks(broken), /missing fragment/);
});

test('accepts recursive localized parity with non-empty values and stable IDs', () => {
  assert.doesNotThrow(() => validateLocalizedContent(validManifest.content));
});
