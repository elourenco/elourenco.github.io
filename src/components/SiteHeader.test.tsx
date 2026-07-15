import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { enContent, ptBRContent } from '../content';
import { SiteHeader } from './SiteHeader';

let observerCallback: IntersectionObserverCallback | undefined;

beforeEach(() => {
  observerCallback = undefined;
  class ObserverMock implements IntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {
      observerCallback = callback;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    root = null;
    rootMargin = '';
    thresholds = [];
    takeRecords = () => [];
  }
  vi.stubGlobal('IntersectionObserver', ObserverMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('SiteHeader', () => {
  it('builds one English home navigation contract for both responsive shells', () => {
    const { container } = render(
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
    ).toEqual(['#home', '#work', '#expertise', '#career', '#contact']);
    for (const index of ['01', '02', '03', '04', '05']) {
      expect(within(primary).getByText(index)).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    }
    expect(
      container.querySelectorAll('.desktop-section-rail__node'),
    ).toHaveLength(5);
    expect(
      container.querySelector('.desktop-section-rail__footer'),
    ).toBeInTheDocument();
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
    for (const link of within(primary).getAllByRole('link')) {
      expect(link).not.toHaveAttribute('aria-current');
    }

    const toggle = screen.getByRole('button', { name: 'Abrir navegação' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const mobileHomeLink = screen
      .getAllByRole('link', { name: 'Início' })
      .at(-1)!;
    expect(mobileHomeLink).toHaveAttribute('href', '/pt-br');
    mobileHomeLink.addEventListener('click', (event) => event.preventDefault());
    fireEvent.click(mobileHomeLink);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggle);
    fireEvent.keyDown(toggle, { key: 'Escape' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('marks the strongest visible home section as the current location', () => {
    render(
      <MemoryRouter initialEntries={['/pt-br']}>
        <SiteHeader content={ptBRContent} route="home" />
        <section id="home" />
        <section id="work" />
      </MemoryRouter>,
    );

    act(() => {
      observerCallback?.(
        [
          {
            target: document.getElementById('work')!,
            isIntersecting: true,
            intersectionRatio: 0.75,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(
      screen.getByRole('link', { name: 'Trabalhos selecionados' }),
    ).toHaveAttribute('aria-current', 'location');
  });
});
