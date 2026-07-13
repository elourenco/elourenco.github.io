import type { Locale, RouteKey } from '../content/schema';

const paths = {
  en: { home: '/en', donaEvents: '/en/projects/dona-events' },
  'pt-BR': { home: '/pt-br', donaEvents: '/pt-br/projetos/dona-events' },
} as const;

export interface ParsedLocalePath {
  locale: Locale;
  route: RouteKey;
}

export function toLocalePath(locale: Locale, route: RouteKey): string {
  return paths[locale][route];
}

export function parseLocalePath(pathname: string): ParsedLocalePath {
  const normalized =
    `/${pathname.split(/[?#]/, 1)[0].split('/').filter(Boolean).join('/')}`.toLowerCase();

  for (const locale of ['en', 'pt-BR'] as const) {
    for (const route of ['home', 'donaEvents'] as const) {
      if (normalized === paths[locale][route].toLowerCase()) {
        return { locale, route };
      }
    }
  }

  return { locale: 'en', route: 'home' };
}

export function localeFromPath(pathname: string): Locale | null {
  const segment = pathname
    .split(/[?#]/, 1)[0]
    .split('/')
    .filter(Boolean)[0]
    ?.toLowerCase();
  if (segment === 'pt-br') return 'pt-BR';
  if (segment === 'en') return 'en';
  return null;
}
