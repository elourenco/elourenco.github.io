import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { useLocale } from './useLocale';

function LocaleSwitcher() {
  const { setLocale } = useLocale();
  const location = useLocation();

  return (
    <>
      <button type="button" onClick={() => setLocale('pt-BR')}>
        Português
      </button>
      <output>{location.pathname}</output>
    </>
  );
}

describe('useLocale', () => {
  afterEach(() => vi.restoreAllMocks());

  it('continues navigation when locale persistence throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage is unavailable', 'SecurityError');
    });

    render(
      <MemoryRouter initialEntries={['/en/projects/dona-events']}>
        <LocaleSwitcher />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Português' }));

    expect(screen.getByText('/pt-br/projetos/dona-events')).toBeInTheDocument();
  });
});
