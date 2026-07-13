import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ProfilePortrait } from './ProfilePortrait';

afterEach(cleanup);

describe('ProfilePortrait', () => {
  it('exposes intrinsic image dimensions and accessible alternative text', () => {
    render(<ProfilePortrait alt="Eduardo Lourenco" />);

    const portrait = screen.getByRole('img', { name: 'Eduardo Lourenco' });
    expect(portrait).toHaveAttribute('width', '752');
    expect(portrait).toHaveAttribute('height', '752');
    expect(portrait).toHaveAttribute('loading', 'lazy');
  });

  it('uses eager loading only when marked as a priority portrait', () => {
    render(<ProfilePortrait alt="Eduardo Lourenco" priority />);

    expect(
      screen.getByRole('img', { name: 'Eduardo Lourenco' }),
    ).toHaveAttribute('loading', 'eager');
  });

  it('reveals the CSS fallback when the image cannot load', () => {
    render(<ProfilePortrait alt="Eduardo Lourenco" />);

    const portrait = screen.getByRole('img', { name: 'Eduardo Lourenco' });
    fireEvent.error(portrait);

    expect(portrait).toHaveAttribute('hidden');
    expect(screen.getByText('EL')).toHaveAttribute('aria-hidden', 'false');
  });
});
