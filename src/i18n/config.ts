import type { Locale } from '../content/schema';
import { localeFromPath } from './locale-paths';

export const LOCALE_STORAGE_KEY = 'architects-nexus.locale';

function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'pt-BR';
}

export function resolveLocale(
  pathname: string,
  browserLanguage: string | undefined,
  storage: Pick<Storage, 'getItem'> | undefined = globalThis.localStorage,
): Locale {
  const pathLocale = localeFromPath(pathname);
  if (pathLocale) return pathLocale;

  const storedLocale = storage?.getItem(LOCALE_STORAGE_KEY) ?? null;
  if (isLocale(storedLocale)) return storedLocale;

  return browserLanguage?.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en';
}

export function persistLocale(
  locale: Locale,
  storage: Pick<Storage, 'setItem'> | undefined = globalThis.localStorage,
): void {
  storage?.setItem(LOCALE_STORAGE_KEY, locale);
}
