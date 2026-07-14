import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ParticleExperience } from './ParticleExperience';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('ParticleExperience', () => {
  it('provides a full containing-block surface while preserving className', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    render(<ParticleExperience className="hero-particles" />);

    const host = screen.getByTestId('experience-fallback').parentElement;
    expect(host).toHaveClass('hero-particles');
    expect(host).toHaveStyle({
      position: 'absolute',
      inset: '0',
      pointerEvents: 'none',
    });
  });
});
