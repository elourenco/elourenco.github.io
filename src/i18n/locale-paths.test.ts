import { describe, expect, it } from 'vitest';
import { parseLocalePath, toLocalePath } from './locale-paths';

describe('localized routes', () => {
  it('maps equivalent Dona routes', () => {
    expect(toLocalePath('en', 'donaEvents')).toBe('/en/projects/dona-events');
    expect(toLocalePath('pt-BR', 'donaEvents')).toBe(
      '/pt-br/projetos/dona-events',
    );
  });

  it('parses supported home and project paths', () => {
    expect(parseLocalePath('/en')).toEqual({ locale: 'en', route: 'home' });
    expect(parseLocalePath('/pt-br/')).toEqual({
      locale: 'pt-BR',
      route: 'home',
    });
    expect(parseLocalePath('/pt-br/projetos/dona-events')).toEqual({
      locale: 'pt-BR',
      route: 'donaEvents',
    });
  });

  it('falls back to English without throwing for unknown paths', () => {
    expect(parseLocalePath('/fr/projets/inconnu')).toEqual({
      locale: 'en',
      route: 'home',
    });
    expect(parseLocalePath('not a path')).toEqual({
      locale: 'en',
      route: 'home',
    });
  });
});
