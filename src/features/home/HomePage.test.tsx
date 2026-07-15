import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { enContent, ptBRContent } from '../../content';
import { HomePage } from './HomePage';
import { pageInternalLinks } from '../../site-contract';

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('HomePage', () => {
  it('renders the English portfolio with semantic navigation and real links', () => {
    render(
      <MemoryRouter initialEntries={['/en']}>
        <HomePage content={enContent} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Eduardo Lourenco Principal Software Engineer',
      }),
    ).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    expect(
      within(screen.getByRole('banner')).getByRole('link', { name: 'Home' }),
    ).toHaveAttribute('href', '#home');
    expect(
      screen.getByRole('link', { name: 'Connect on LinkedIn' }),
    ).toHaveAttribute('href', 'https://www.linkedin.com/in/dudulourenco');
    expect(screen.getByText('Dona Events')).toBeVisible();

    expect(
      screen.getByRole('link', { name: 'Skip to content' }),
    ).toHaveAttribute('href', '#main-content');
    expect(
      screen.getByRole('link', { name: 'Download résumé (PT-BR)' }),
    ).toHaveAttribute('href', '/cv-eduardo-lourenco-pt-br.pdf');
    expect(
      screen.getByRole('link', { name: 'Download résumé (PT-BR)' }),
    ).toHaveAttribute('download');

    const primary = screen.getByRole('navigation', { name: 'Primary' });
    const expectedNavigation = [
      ['Expertise', '#expertise'],
      ['Selected work', '#work'],
      ['Career', '#career'],
      ['Contact', '#contact'],
    ] as const;
    for (const [label, href] of expectedNavigation) {
      expect(
        within(primary).getByRole('link', { name: label }),
      ).toHaveAttribute('href', href);
    }

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
    for (const id of ['expertise', 'work', 'career', 'contact']) {
      expect(main.querySelector(`#${id}`)).toBeInTheDocument();
    }
    expect(
      screen
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
        .filter((href): href is string =>
          Boolean(href?.startsWith('/') || href?.startsWith('#')),
        ),
    ).toEqual(pageInternalLinks('en', 'home'));
  });

  it('renders equivalent Portuguese content and section links', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/pt-br']}>
        <HomePage content={ptBRContent} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Eduardo Lourenco Principal Software Engineer',
      }),
    ).toBeVisible();
    expect(
      screen.getByText('IA · Mobile · Arquitetura de Software'),
    ).toBeVisible();
    expect(
      within(screen.getByRole('banner')).getByRole('link', { name: 'Início' }),
    ).toHaveAttribute('href', '#home');
    expect(
      screen.getByRole('link', { name: 'Conectar no LinkedIn' }),
    ).toHaveAttribute('href', 'https://www.linkedin.com/in/dudulourenco');

    expect(
      screen.getByRole('link', { name: 'Pular para o conteúdo' }),
    ).toHaveAttribute('href', '#main-content');
    expect(
      screen.getByRole('link', { name: 'Baixar currículo' }),
    ).toHaveAttribute('href', '/cv-eduardo-lourenco-pt-br.pdf');
    expect(
      screen.getByRole('link', { name: 'Baixar currículo' }),
    ).toHaveAttribute('download');

    const primary = screen.getByRole('navigation', {
      name: 'Navegação principal',
    });
    const expectedNavigation = [
      ['Especialidades', '#expertise'],
      ['Trabalhos selecionados', '#work'],
      ['Carreira', '#career'],
      ['Contato', '#contact'],
    ] as const;
    for (const [label, href] of expectedNavigation) {
      expect(
        within(primary).getByRole('link', { name: label }),
      ).toHaveAttribute('href', href);
    }

    expect(container).not.toHaveTextContent(
      /AI CORE|FEATURED WORK|SYSTEM MAP|CAPABILITIES|FLIGHT LOG|OPEN CHANNEL|IDENTITY/i,
    );

    for (const ornament of ['// 01', '// 02', '// 03', '// 04', 'EL-01']) {
      expect(screen.getByText(ornament)).toHaveAttribute('aria-hidden', 'true');
    }
  });
});
