import type { Locale, RouteKey } from './content/schema';
import { toLocalePath } from './i18n/locale-paths';
import { SITE_ORIGIN } from './site-contract';

export const metadata = {
  en: {
    home: {
      title: 'Eduardo Lourenco | Principal AI System Architect',
      description:
        'Principal AI System Architect focused on AI, mobile engineering and scalable software architecture.',
    },
    donaEvents: {
      title: 'Dona Events | Eduardo Lourenco',
      description:
        'Dona Events is an AI-powered event platform created and engineered end to end by Eduardo Lourenco.',
    },
  },
  'pt-BR': {
    home: {
      title: 'Eduardo Lourenco | Principal AI System Architect',
      description:
        'Principal AI System Architect com foco em IA, engenharia de aplicativos móveis e arquitetura de software escalável.',
    },
    donaEvents: {
      title: 'Dona Events | Eduardo Lourenco',
      description:
        'Dona Events é uma plataforma de eventos com IA criada e desenvolvida de ponta a ponta por Eduardo Lourenco.',
    },
  },
} satisfies Record<
  Locale,
  Record<RouteKey, { title: string; description: string }>
>;

export function seoMetaTags(locale: Locale, route: RouteKey) {
  const current = metadata[locale][route];
  const image = `${SITE_ORIGIN}/${route === 'home' ? 'og-home' : 'og-dona-events'}.png`;
  const imageAlt =
    route === 'home'
      ? 'Eduardo Lourenco — Principal AI System Architect'
      : 'Dona Events — Creator & Principal Engineer: Eduardo Lourenco';
  const properties: Record<string, string> = {
    'og:type': route === 'home' ? 'profile' : 'website',
    'og:site_name': 'Eduardo Lourenco',
    'og:title': current.title,
    'og:description': current.description,
    'og:url': `${SITE_ORIGIN}${toLocalePath(locale, route)}`,
    'og:locale': locale === 'pt-BR' ? 'pt_BR' : 'en_US',
    'og:locale:alternate': locale === 'pt-BR' ? 'en_US' : 'pt_BR',
    'og:image': image,
    'og:image:type': 'image/png',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': imageAlt,
  };
  const names: Record<string, string> = {
    description: current.description,
    'twitter:card': 'summary_large_image',
    'twitter:title': current.title,
    'twitter:description': current.description,
    'twitter:image': image,
    'twitter:image:alt': imageAlt,
  };
  return [
    ...Object.entries(properties).map(([key, content]) => ({
      attribute: 'property' as const,
      key,
      content,
    })),
    ...Object.entries(names).map(([key, content]) => ({
      attribute: 'name' as const,
      key,
      content,
    })),
  ];
}
