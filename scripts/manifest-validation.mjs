import assert from 'node:assert/strict';

function contentShape(value, path = 'content') {
  if (Array.isArray(value)) {
    assert.ok(value.length > 0, `${path} must not be empty`);
    return value.map((item, index) => {
      if (item && typeof item === 'object' && 'id' in item) {
        assert.equal(typeof item.id, 'string', `${path}[${index}].id`);
        assert.ok(item.id.trim(), `${path}[${index}].id must not be empty`);
        contentShape(item, `${path}[${index}]`);
        return { id: item.id, shape: contentShape(item, `${path}[${index}]`) };
      }
      return contentShape(item, `${path}[${index}]`);
    });
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value).filter(([key]) => key !== 'locale');
    assert.ok(entries.length > 0, `${path} must not be empty`);
    return Object.fromEntries(
      entries.map(([key, child]) => [
        key,
        contentShape(child, `${path}.${key}`),
      ]),
    );
  }

  assert.notEqual(value, null, `${path} must not be null`);
  assert.notEqual(value, undefined, `${path} must be defined`);
  if (typeof value === 'string') {
    assert.ok(value.trim(), `${path} must not be empty`);
  }
  return typeof value;
}

export function validateLocalizedContent(content) {
  assert.deepEqual(
    contentShape(content.en, 'content.en'),
    contentShape(content['pt-BR'], 'content.pt-BR'),
    'localized content structure or stable IDs differ',
  );
}

export function validateBuiltLinks(manifest) {
  const pagesByPath = new Map(
    manifest.pages.map((page) => [page.pathname, page]),
  );
  const targets = new Set([...pagesByPath.keys(), ...manifest.assets]);

  for (const page of manifest.pages) {
    for (const rawTarget of page.internalLinks) {
      const target = new URL(
        rawTarget,
        `https://built.invalid${page.pathname}`,
      );
      assert.ok(
        targets.has(target.pathname),
        `${page.pathname}: missing route or asset ${target.pathname}`,
      );
      if (target.hash) {
        const destination = pagesByPath.get(target.pathname);
        assert.ok(destination, `${target.pathname}: fragments require a page`);
        const fragment = decodeURIComponent(target.hash.slice(1));
        assert.ok(
          destination.anchors.includes(fragment),
          `${page.pathname}: missing fragment #${fragment} on ${target.pathname}`,
        );
      }
    }
    for (const rawTarget of page.externalLinks) {
      const target = new URL(rawTarget);
      assert.equal(target.protocol, 'https:', `${rawTarget} must use HTTPS`);
      assert.ok(target.hostname, `${rawTarget} must have a hostname`);
    }
  }
}
