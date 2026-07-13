import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { enContent, ptBRContent } from '../../content';
import { HomePage } from './HomePage';

afterEach(cleanup);

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
        name: 'Principal Software Engineer',
      }),
    ).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Connect on LinkedIn' }),
    ).toHaveAttribute('href', 'https://www.linkedin.com/in/dudulourenco');
    expect(screen.getByText('Dona Events')).toBeVisible();

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
    for (const id of ['expertise', 'work', 'career', 'contact']) {
      expect(main.querySelector(`#${id}`)).toBeInTheDocument();
    }
  });

  it('renders equivalent Portuguese content and section links', () => {
    render(
      <MemoryRouter initialEntries={['/pt-br']}>
        <HomePage content={ptBRContent} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Principal Software Engineer',
      }),
    ).toBeVisible();
    expect(
      screen.getByText('IA · Mobile · Arquitetura de Software'),
    ).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Conectar no LinkedIn' }),
    ).toHaveAttribute('href', 'https://www.linkedin.com/in/dudulourenco');

    const primary = screen.getByRole('navigation', {
      name: 'Navegação principal',
    });
    expect(
      within(primary).getByRole('link', { name: 'Especialidades' }),
    ).toHaveAttribute('href', '#expertise');
    expect(
      within(primary).getByRole('link', { name: 'Contato' }),
    ).toHaveAttribute('href', '#contact');
  });
});
