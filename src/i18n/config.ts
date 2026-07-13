import type { Locale } from '../content/schema';
import { localeFromPath } from './locale-paths';

export const LOCALE_STORAGE_KEY = 'architects-nexus.locale';

function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'pt-BR';
}

function getLocalStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

export function resolveLocale(
  pathname: string,
  browserLanguage: string | undefined,
  storage: Pick<Storage, 'getItem'> | undefined = getLocalStorage(),
): Locale {
  const pathLocale = localeFromPath(pathname);
  if (pathLocale) return pathLocale;

  let storedLocale: string | null = null;
  try {
    storedLocale = storage?.getItem(LOCALE_STORAGE_KEY) ?? null;
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
  if (isLocale(storedLocale)) return storedLocale;

  return browserLanguage?.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en';
}

export function persistLocale(
  locale: Locale,
  storage: Pick<Storage, 'setItem'> | undefined = getLocalStorage(),
): void {
  try {
    storage?.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Locale persistence is best-effort; switching must still complete.
  }
}
