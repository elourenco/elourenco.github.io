import type { Locale, RouteKey } from './content';
import { toLocalePath } from './i18n/locale-paths';

export const SITE_ORIGIN = 'https://elourenco.github.io';

export const EXTERNAL_URLS = {
  linkedin: 'https://www.linkedin.com/in/dudulourenco',
  github: 'https://github.com/elourenco',
  donaEvents: 'https://dona.events',
} as const;

export const PUBLIC_ASSETS = {
  resume: '/cv-eduardo-lourenco-pt-br.pdf',
} as const;

export const SITE_ANCHORS = {
  main: 'main-content',
  home: {
    heroTitle: 'hero-title',
    work: 'work',
    workTitle: 'work-title',
    expertise: 'expertise',
    expertiseTitle: 'expertise-title',
    career: 'career',
    careerTitle: 'career-title',
    contact: 'contact',
    contactTitle: 'contact-title',
  },
  donaEvents: {
    outcomeTitle: 'dona-outcome-title',
    ownershipTitle: 'dona-ownership-title',
    capabilitiesTitle: 'dona-capabilities-title',
    platformsTitle: 'dona-platforms-title',
  },
} as const;

export const HOME_SECTION_ANCHORS = [
  SITE_ANCHORS.home.work,
  SITE_ANCHORS.home.expertise,
  SITE_ANCHORS.home.career,
  SITE_ANCHORS.home.contact,
] as const;

export const HOME_ANCHORS = [
  SITE_ANCHORS.main,
  ...Object.values(SITE_ANCHORS.home),
] as const;

export const DONA_EVENTS_ANCHORS = [
  SITE_ANCHORS.main,
  ...Object.values(SITE_ANCHORS.donaEvents),
] as const;

export const INTERNAL_DESTINATIONS = {
  fragment: (anchor: string) => `#${anchor}`,
  route: (locale: Locale, route: RouteKey) => toLocalePath(locale, route),
  routeFragment: (locale: Locale, route: RouteKey, anchor: string) =>
    `${toLocalePath(locale, route)}#${anchor}`,
} as const;

export function pageInternalLinks(locale: Locale, route: RouteKey): string[] {
  if (route === 'home') {
    return [
      INTERNAL_DESTINATIONS.fragment(SITE_ANCHORS.main),
      INTERNAL_DESTINATIONS.fragment(SITE_ANCHORS.main),
      ...HOME_SECTION_ANCHORS.map(INTERNAL_DESTINATIONS.fragment),
      INTERNAL_DESTINATIONS.route('en', 'home'),
      INTERNAL_DESTINATIONS.route('pt-BR', 'home'),
      INTERNAL_DESTINATIONS.fragment(SITE_ANCHORS.home.work),
      PUBLIC_ASSETS.resume,
      INTERNAL_DESTINATIONS.route(locale, 'donaEvents'),
    ];
  }

  return [
    INTERNAL_DESTINATIONS.fragment(SITE_ANCHORS.main),
    INTERNAL_DESTINATIONS.route(locale, 'home'),
    ...HOME_SECTION_ANCHORS.map((anchor) =>
      INTERNAL_DESTINATIONS.routeFragment(locale, 'home', anchor),
    ),
    INTERNAL_DESTINATIONS.route('en', 'donaEvents'),
    INTERNAL_DESTINATIONS.route('pt-BR', 'donaEvents'),
  ];
}
