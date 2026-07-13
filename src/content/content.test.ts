import { describe, expect, it } from 'vitest';
import { enContent } from './en';
import { getContent, ptBRContent } from './index';

describe('localized portfolio content', () => {
  it('keeps content structures in parity', () => {
    expect(Object.keys(enContent)).toEqual(Object.keys(ptBRContent));
    expect(enContent.expertise.map((item) => item.id)).toEqual(
      ptBRContent.expertise.map((item) => item.id),
    );
    expect(enContent.career.items.map((item) => item.company)).toEqual(
      ptBRContent.career.items.map((item) => item.company),
    );
  });

  it('returns complete localized content for each supported locale', () => {
    expect(getContent('en')).toBe(enContent);
    expect(getContent('pt-BR')).toBe(ptBRContent);
    expect(enContent.expertise).toHaveLength(3);
    expect(enContent.career.items.map((item) => item.company)).toEqual([
      'IXC Soft',
      'Midway',
      'VAI Car',
      'Quero Bolsa',
      'Claro',
    ]);
    expect(ptBRContent.dona.metric).toContain('35 mil');
  });
});
