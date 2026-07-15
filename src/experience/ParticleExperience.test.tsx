import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ParticleExperience } from './ParticleExperience';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('ParticleExperience', () => {
  it('delegates geometry to its base class while preserving className', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    render(<ParticleExperience className="hero-particles" />);

    const host = screen.getByTestId('experience-fallback').parentElement;
    expect(host).toHaveClass('particle-experience', 'hero-particles');
    expect(host).not.toHaveAttribute('style');
  });
});
