import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { HeroPortrait } from './HeroPortrait';

afterEach(cleanup);

describe('HeroPortrait', () => {
  it('starts loading with intrinsic dimensions and priority hints', () => {
    const { container } = render(
      <HeroPortrait alt="Portrait of Eduardo Lourenco" priority />,
    );

    expect(container.querySelector('figure')).toHaveAttribute(
      'data-image-state',
      'loading',
    );
    const portrait = screen.getByRole('img', {
      name: 'Portrait of Eduardo Lourenco',
    });
    expect(portrait).toHaveAttribute('width', '752');
    expect(portrait).toHaveAttribute('height', '752');
    expect(portrait).toHaveAttribute('loading', 'eager');
    expect(portrait).toHaveAttribute('fetchpriority', 'high');
  });

  it('marks the portrait ready only after the image loads', () => {
    const { container } = render(
      <HeroPortrait alt="Portrait of Eduardo Lourenco" />,
    );

    fireEvent.load(
      screen.getByRole('img', { name: 'Portrait of Eduardo Lourenco' }),
    );

    expect(container.querySelector('figure')).toHaveAttribute(
      'data-image-state',
      'ready',
    );
  });

  it('hides a failed image and exposes decorative fallback initials', () => {
    const { container } = render(
      <HeroPortrait alt="Portrait of Eduardo Lourenco" />,
    );
    const portrait = screen.getByRole('img', {
      name: 'Portrait of Eduardo Lourenco',
    });

    fireEvent.error(portrait);

    expect(container.querySelector('figure')).toHaveAttribute(
      'data-image-state',
      'fallback',
    );
    expect(portrait).toHaveAttribute('hidden');
    expect(screen.getByText('EL')).toHaveAttribute('aria-hidden', 'true');
  });
});
