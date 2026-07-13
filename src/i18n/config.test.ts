import { beforeEach, describe, expect, it } from 'vitest';
import { LOCALE_STORAGE_KEY, persistLocale, resolveLocale } from './config';

describe('locale selection', () => {
  beforeEach(() => localStorage.clear());

  it('uses path, stored preference, browser language, then English', () => {
    expect(resolveLocale('/pt-br/projetos/dona-events', 'en-US')).toBe('pt-BR');

    localStorage.setItem(LOCALE_STORAGE_KEY, 'pt-BR');
    expect(resolveLocale('/', 'en-US')).toBe('pt-BR');

    localStorage.clear();
    expect(resolveLocale('/', 'pt-PT')).toBe('pt-BR');
    expect(resolveLocale('/', 'de-DE')).toBe('en');
  });

  it('does not persist automatic detection', () => {
    expect(resolveLocale('/', 'pt-BR')).toBe('pt-BR');
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBeNull();
  });

  it('persists only supported explicit locale switches', () => {
    persistLocale('pt-BR');
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('pt-BR');
  });
});
