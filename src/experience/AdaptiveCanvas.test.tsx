import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdaptiveCanvas } from './AdaptiveCanvas';

let canvasShouldThrow = false;

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => {
    if (canvasShouldThrow) {
      throw new Error('WebGL render failed');
    }

    return <div data-testid="r3f-canvas">{children}</div>;
  },
}));

beforeEach(() => {
  canvasShouldThrow = false;
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    {} as never,
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('AdaptiveCanvas', () => {
  it('renders the resilient fallback when explicitly forced', () => {
    render(<AdaptiveCanvas section="arrival" forceFallback />);

    expect(screen.getByTestId('experience-fallback')).toBeVisible();
    expect(screen.queryByTestId('r3f-canvas')).not.toBeInTheDocument();
  });

  it('does not mount R3F when WebGL is unavailable', () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);

    render(<AdaptiveCanvas section="arrival" />);

    expect(screen.getByTestId('experience-fallback')).toBeVisible();
    expect(screen.queryByTestId('r3f-canvas')).not.toBeInTheDocument();
  });

  it('isolates canvas render errors behind the fallback', () => {
    canvasShouldThrow = true;
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(<AdaptiveCanvas section="arrival" />);

    expect(screen.getByTestId('experience-fallback')).toBeVisible();
  });
});
