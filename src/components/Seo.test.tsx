import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Seo } from './Seo';

afterEach(() => {
  document.head.querySelectorAll('[data-seo]').forEach((node) => node.remove());
});

describe('Seo', () => {
  it('replaces server metadata and updates the share preview on navigation', () => {
    document.head.insertAdjacentHTML(
      'beforeend',
      '<meta data-seo="true" property="og:title" content="Static title" /><meta data-seo="true" property="og:image" content="https://example.com/stale.png" />',
    );
    const view = render(<Seo locale="en" route="home" />);
    const meta = (key: string) =>
      document.head.querySelectorAll<HTMLMetaElement>(
        `meta[property="${key}"], meta[name="${key}"]`,
      );
    expect(meta('og:title')).toHaveLength(1);
    expect(meta('og:image')).toHaveLength(1);
    expect(meta('og:image')[0].content).toBe(
      'https://eduardolourenco.dev/og-home.png',
    );
    expect(meta('twitter:card')[0]?.content).toBe('summary_large_image');
    view.rerender(<Seo locale="pt-BR" route="donaEvents" />);
    expect(meta('og:image')).toHaveLength(1);
    expect(meta('og:image')[0].content).toBe(
      'https://eduardolourenco.dev/og-dona-events.png',
    );
    expect(meta('og:locale')[0]?.content).toBe('pt_BR');
    expect(meta('twitter:title')[0]?.content).toBe(
      'Dona Events | Eduardo Lourenco',
    );
  });

  it('publishes localized canonical, alternates, Open Graph and JSON-LD', () => {
    render(<Seo locale="pt-BR" route="donaEvents" />);

    expect(document.documentElement.lang).toBe('pt-BR');
    expect(document.title).toBe('Dona Events | Eduardo Lourenco');
    expect(
      document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
        ?.href,
    ).toBe('https://eduardolourenco.dev/pt-br/projetos/dona-events');
    expect(
      document.head.querySelectorAll('link[rel="alternate"][hreflang]'),
    ).toHaveLength(3);
    expect(
      document.head.querySelector<HTMLMetaElement>('meta[property="og:locale"]')
        ?.content,
    ).toBe('pt_BR');
    expect(
      JSON.parse(
        document.head.querySelector<HTMLScriptElement>(
          'script[type="application/ld+json"]',
        )?.textContent ?? '{}',
      ),
    ).toMatchObject({ '@type': 'SoftwareApplication', name: 'Dona Events' });
  });

  it('keeps exactly one localized description while navigating locales', () => {
    const view = render(<Seo locale="en" route="home" />);
    const descriptions = () =>
      document.head.querySelectorAll<HTMLMetaElement>(
        'meta[name="description"]',
      );

    expect(descriptions()).toHaveLength(1);
    expect(descriptions()[0]?.content).toContain('focused on AI');

    view.rerender(<Seo locale="pt-BR" route="home" />);

    expect(descriptions()).toHaveLength(1);
    expect(descriptions()[0]?.content).toContain('com foco em IA');
  });
});
