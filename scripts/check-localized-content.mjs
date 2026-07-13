import assert from 'node:assert/strict';
import { enContent } from '../src/content/en.ts';
import { ptBRContent } from '../src/content/pt-BR.ts';

function shape(value) {
  if (Array.isArray(value)) {
    return value.map((item) =>
      item && typeof item === 'object' && 'id' in item ? item.id : shape(item),
    );
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== 'locale')
        .map(([key, child]) => [key, shape(child)]),
    );
  }
  return typeof value;
}

assert.deepEqual(shape(enContent), shape(ptBRContent));
assert.deepEqual(
  enContent.expertise.map(({ id }) => id),
  ptBRContent.expertise.map(({ id }) => id),
);
console.log('Localized content parity: OK');
