import { useEffect } from 'react';
import type { Locale, RouteKey } from '../content';
import { toLocalePath } from '../i18n/locale-paths';
import { EXTERNAL_URLS, SITE_ORIGIN } from '../site-contract';
import { metadata, seoMetaTags } from '../seo';

function appendMeta(
  attribute: 'name' | 'property',
  key: string,
  content: string,
) {
  const node = document.createElement('meta');
  node.dataset.seo = 'true';
  node.setAttribute(attribute, key);
  node.content = content;
  document.head.append(node);
}

function appendLink(rel: string, href: string, hreflang?: string) {
  const node = document.createElement('link');
  node.dataset.seo = 'true';
  node.rel = rel;
  node.href = href;
  if (hreflang) node.hreflang = hreflang;
  document.head.append(node);
}

export function Seo({ locale, route }: { locale: Locale; route: RouteKey }) {
  useEffect(() => {
    const current = metadata[locale][route];
    const canonical = `${SITE_ORIGIN}${toLocalePath(locale, route)}`;
    document.documentElement.lang = locale;
    document.title = current.title;

    // Static HTML already contains SEO tags for crawlers. Replace them on mount.
    document.head
      .querySelectorAll('[data-seo]')
      .forEach((node) => node.remove());
    for (const { attribute, key, content } of seoMetaTags(locale, route)) {
      appendMeta(attribute, key, content);
    }
    appendLink('canonical', canonical);
    appendLink('alternate', `${SITE_ORIGIN}${toLocalePath('en', route)}`, 'en');
    appendLink(
      'alternate',
      `${SITE_ORIGIN}${toLocalePath('pt-BR', route)}`,
      'pt-BR',
    );
    appendLink(
      'alternate',
      `${SITE_ORIGIN}${toLocalePath('en', route)}`,
      'x-default',
    );

    const jsonLd = document.createElement('script');
    jsonLd.dataset.seo = 'true';
    jsonLd.type = 'application/ld+json';
    jsonLd.textContent = JSON.stringify(
      route === 'home'
        ? {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Eduardo Lourenco',
            jobTitle: 'Principal AI System Architect',
            url: canonical,
            sameAs: [EXTERNAL_URLS.linkedin, EXTERNAL_URLS.github],
          }
        : {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Dona Events',
            applicationCategory: 'LifestyleApplication',
            url: EXTERNAL_URLS.donaEvents,
            creator: { '@type': 'Person', name: 'Eduardo Lourenco' },
          },
    );
    document.head.append(jsonLd);

    return () => {
      document.head
        .querySelectorAll('[data-seo]')
        .forEach((node) => node.remove());
    };
  }, [locale, route]);

  return null;
}
