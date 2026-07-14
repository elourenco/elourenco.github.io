import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { enContent, ptBRContent } from '../../content';
import { DonaEventsPage } from './DonaEventsPage';
import { pageInternalLinks } from '../../site-contract';

afterEach(cleanup);

describe('DonaEventsPage', () => {
  it('exposes the shared editorial class contracts without changing semantics', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/en/projects/dona-events']}>
        <DonaEventsPage content={enContent} />
      </MemoryRouter>,
    );

    expect(container.querySelector('main.dona-page')).toBeInTheDocument();
    expect(container.querySelector('article.dona-case')).toBeInTheDocument();
    expect(
      container.querySelector('header.dona-case__hero'),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll('section.dona-case__section'),
    ).toHaveLength(4);
    expect(container.querySelectorAll('ul.dona-case__list')).toHaveLength(2);
    expect(container.querySelector('a.dona-case__cta')).toHaveAttribute(
      'target',
      '_blank',
    );
  });

  it('renders the public English case without proprietary disclosures', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/en/projects/dona-events']}>
        <DonaEventsPage content={enContent} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Dona Events' }),
    ).toBeVisible();
    expect(screen.getByText('Creator & Principal Engineer')).toBeVisible();
    expect(screen.getByText(/35k\+ events created/i)).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Visit Dona Events' }),
    ).toHaveAttribute('href', 'https://dona.events');
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/en',
    );
    const primary = screen.getByRole('navigation', { name: 'Primary' });
    const expectedNavigation = [
      ['Expertise', '/en#expertise'],
      ['Selected work', '/en#work'],
      ['Career', '/en#career'],
      ['Contact', '/en#contact'],
    ] as const;
    for (const [label, href] of expectedNavigation) {
      expect(
        within(primary).getByRole('link', { name: label }),
      ).toHaveAttribute('href', href);
    }
    expect(
      screen
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
        .filter((href): href is string =>
          Boolean(href?.startsWith('/') || href?.startsWith('#')),
        ),
    ).toEqual(pageInternalLinks('en', 'donaEvents'));
    expect(container).not.toHaveTextContent(
      /provider|model latency|internal architecture|private metric/i,
    );
  });

  it('renders the equivalent public Portuguese case on its canonical locale', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/pt-br/projetos/dona-events']}>
        <DonaEventsPage content={ptBRContent} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Dona Events' }),
    ).toBeVisible();
    expect(screen.getByText('Creator & Principal Engineer')).toBeVisible();
    expect(screen.getByText(/35 mil\+ eventos criados/i)).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Visitar Dona Events' }),
    ).toHaveAttribute('href', 'https://dona.events');
    expect(
      screen.getByRole('navigation', { name: 'Navegação principal' }),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute(
      'href',
      '/pt-br',
    );
    const primary = screen.getByRole('navigation', {
      name: 'Navegação principal',
    });
    const expectedNavigation = [
      ['Especialidades', '/pt-br#expertise'],
      ['Trabalhos selecionados', '/pt-br#work'],
      ['Carreira', '/pt-br#career'],
      ['Contato', '/pt-br#contact'],
    ] as const;
    for (const [label, href] of expectedNavigation) {
      expect(
        within(primary).getByRole('link', { name: label }),
      ).toHaveAttribute('href', href);
    }
    expect(container).not.toHaveTextContent(
      /provedor|latência de modelo|arquitetura interna|métrica privada/i,
    );
  });
});
