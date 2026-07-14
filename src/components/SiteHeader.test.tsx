import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { enContent, ptBRContent } from '../content';
import { SiteHeader } from './SiteHeader';

afterEach(cleanup);

describe('SiteHeader', () => {
  it('builds one English home navigation contract for both responsive shells', () => {
    render(
      <MemoryRouter initialEntries={['/en']}>
        <SiteHeader content={enContent} route="home" />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('navigation', { name: 'Primary' })).toHaveLength(
      1,
    );
    expect(screen.getAllByRole('link', { name: 'Home' })).toHaveLength(1);
    expect(
      screen.getAllByRole('navigation', { name: 'Language' }),
    ).toHaveLength(1);

    const primary = screen.getByRole('navigation', { name: 'Primary' });
    expect(
      within(primary)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(['#main-content', '#work', '#expertise', '#career', '#contact']);
    for (const index of ['01', '02', '03', '04', '05']) {
      expect(within(primary).getByText(index)).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    }
  });

  it('uses localized home paths on project routes and closes the mobile disclosure', () => {
    render(
      <MemoryRouter initialEntries={['/pt-br/projetos/dona-events']}>
        <SiteHeader content={ptBRContent} route="donaEvents" />
      </MemoryRouter>,
    );

    const primary = screen.getByRole('navigation', {
      name: 'Navegação principal',
    });
    expect(
      within(primary)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual([
      '/pt-br',
      '/pt-br#work',
      '/pt-br#expertise',
      '/pt-br#career',
      '/pt-br#contact',
    ]);

    const toggle = screen.getByRole('button', { name: 'Abrir navegação' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getAllByRole('link', { name: 'Início' }).at(-1)!);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggle);
    fireEvent.keyDown(toggle, { key: 'Escape' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });
});
