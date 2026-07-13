import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';

function CurrentPath() {
  return <output>{useLocation().pathname}</output>;
}

describe('LanguageSwitcher', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('preserves the home route while switching locale', () => {
    render(
      <MemoryRouter initialEntries={['/en']}>
        <LanguageSwitcher route="home" />
        <CurrentPath />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    fireEvent.click(screen.getByRole('link', { name: 'PT-BR' }));
    expect(screen.getByText('/pt-br')).toBeInTheDocument();
  });

  it('preserves the project route when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage is unavailable', 'SecurityError');
    });

    render(
      <MemoryRouter initialEntries={['/pt-br/projetos/dona-events']}>
        <LanguageSwitcher route="donaEvents" />
        <CurrentPath />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'EN' }));
    expect(screen.getByText('/en/projects/dona-events')).toBeInTheDocument();
  });
});
