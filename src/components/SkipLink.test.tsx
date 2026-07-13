import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { SkipLink } from './SkipLink';

afterEach(cleanup);

describe('SkipLink', () => {
  it('exposes the dedicated styling and navigation contract', () => {
    render(<SkipLink label="Pular para o conteúdo" />);

    const link = screen.getByRole('link', { name: 'Pular para o conteúdo' });
    expect(link).toHaveClass('skip-link');
    expect(link).toHaveAttribute('href', '#main-content');
  });
});
