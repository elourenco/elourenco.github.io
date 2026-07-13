import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Seo } from './Seo';

afterEach(() => {
  document.head.querySelectorAll('[data-seo]').forEach((node) => node.remove());
});

describe('Seo', () => {
  it('publishes localized canonical, alternates, Open Graph and JSON-LD', () => {
    render(<Seo locale="pt-BR" route="donaEvents" />);

    expect(document.documentElement.lang).toBe('pt-BR');
    expect(document.title).toBe('Dona Events | Eduardo Lourenco');
    expect(
      document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
        ?.href,
    ).toBe('https://elourenco.github.io/pt-br/projetos/dona-events');
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
