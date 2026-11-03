import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';

const dist = new URL('../dist/', import.meta.url);
const pages = [
  ['index.html', '/en', 'en', 'profile'],
  ['en/index.html', '/en', 'en', 'profile'],
  ['pt-br/index.html', '/pt-br', 'pt-BR', 'profile'],
  [
    'en/projects/dona-events/index.html',
    '/en/projects/dona-events',
    'en',
    'website',
  ],
  [
    'pt-br/projetos/dona-events/index.html',
    '/pt-br/projetos/dona-events',
    'pt-BR',
    'website',
  ],
];

for (const [file, path, locale, type] of pages) {
  test(`publishes a complete share preview without JavaScript: ${path} (${file})`, async () => {
    assert.ok(
      existsSync(new URL(file, dist)),
      `Missing static document: ${file}`,
    );
    const dom = new JSDOM(readFileSync(new URL(file, dist), 'utf8'));
    const document = dom.window.document;
    const meta = (key) => {
      const nodes = document.head.querySelectorAll(
        `meta[property="${key}"], meta[name="${key}"]`,
      );
      assert.equal(nodes.length, 1, `Expected exactly one ${key}`);
      assert.ok(nodes[0].content.length > 0, `Empty ${key}`);
      return nodes[0].content;
    };
    assert.equal(document.documentElement.lang, locale);
    assert.equal(meta('og:url'), `https://eduardolourenco.dev${path}`);
    assert.equal(
      document.querySelector('link[rel="canonical"]').href,
      meta('og:url'),
    );
    assert.equal(meta('og:type'), type);
    assert.equal(meta('og:locale'), locale === 'pt-BR' ? 'pt_BR' : 'en_US');
    assert.equal(meta('og:title'), document.title);
    assert.equal(meta('og:description'), meta('description'));
    assert.equal(meta('twitter:card'), 'summary_large_image');
    assert.equal(meta('twitter:image'), meta('og:image'));
    assert.equal(meta('twitter:title'), document.title);
    assert.equal(meta('twitter:description'), meta('description'));
    assert.equal(meta('twitter:image:alt'), meta('og:image:alt'));
    const image = new URL(meta('og:image'));
    assert.equal(image.origin, 'https://eduardolourenco.dev');
    const dimensions = await sharp(
      new URL(`.${image.pathname}`, dist).pathname,
    ).metadata();
    assert.equal(dimensions.width, Number(meta('og:image:width')));
    assert.equal(dimensions.height, Number(meta('og:image:height')));
    assert.equal(dimensions.width, 1200);
    assert.equal(dimensions.height, 630);
    assert.equal(meta('og:image:type'), `image/${dimensions.format}`);
    const entry = document.querySelector('script[type="module"][src]');
    assert.ok(entry, 'Static route must retain the app entry');
    assert.ok(existsSync(new URL(`.${entry.getAttribute('src')}`, dist)));
    dom.window.close();
  });
}
