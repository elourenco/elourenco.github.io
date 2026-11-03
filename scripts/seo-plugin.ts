import type { Plugin } from 'vite';
import type { Locale, RouteKey } from '../src/content/schema';
import { parseLocalePath, toLocalePath } from '../src/i18n/locale-paths';
import { metadata, seoMetaTags } from '../src/seo';
import { SITE_ORIGIN } from '../src/site-contract';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

function renderSeo(html: string, locale: Locale, route: RouteKey): string {
  const tags = seoMetaTags(locale, route).map(
    ({ attribute, key, content }) =>
      `<meta data-seo="true" ${attribute}="${key}" content="${escapeHtml(content)}" />`,
  );
  tags.push(
    `<link data-seo="true" rel="canonical" href="${SITE_ORIGIN}${toLocalePath(locale, route)}" />`,
  );
  for (const alternate of ['en', 'pt-BR', 'x-default'] as const) {
    tags.push(
      `<link data-seo="true" rel="alternate" hreflang="${alternate}" href="${SITE_ORIGIN}${toLocalePath(alternate === 'x-default' ? 'en' : alternate, route)}" />`,
    );
  }
  return html
    .replace(/<html lang="[^"]*"/, `<html lang="${locale}"`)
    .replace(
      /<title>[\s\S]*?<\/title>/,
      `<title>${escapeHtml(metadata[locale][route].title)}</title>`,
    )
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->\s*/, '')
    .replace(
      '</head>',
      `<!--seo:start-->\n${tags.join('\n')}\n<!--seo:end-->\n</head>`,
    );
}

export function staticSeo(): Plugin {
  return {
    name: 'static-seo',
    enforce: 'post',
    transformIndexHtml(html, context) {
      const { locale, route } = parseLocalePath(
        context.originalUrl ?? context.path,
      );
      return renderSeo(html, locale, route);
    },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const entry = bundle['index.html'];
        if (
          !entry ||
          entry.type !== 'asset' ||
          typeof entry.source !== 'string'
        ) {
          this.error('Static SEO requires the built index.html asset.');
        }
        for (const locale of ['en', 'pt-BR'] as const) {
          for (const route of ['home', 'donaEvents'] as const) {
            this.emitFile({
              type: 'asset',
              fileName: `${toLocalePath(locale, route).slice(1)}/index.html`,
              source: renderSeo(entry.source, locale, route),
            });
          }
        }
      },
    },
  };
}
