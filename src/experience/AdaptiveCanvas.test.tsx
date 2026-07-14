import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdaptiveCanvas } from './AdaptiveCanvas';

let idleCallback: IdleRequestCallback | undefined;
let intersectionCallback: IntersectionObserverCallback | undefined;

vi.mock('./ParticleScene', () => ({
  ParticleScene: () => <div data-testid="particle-canvas" />,
}));

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    {} as never,
  );
  window.matchMedia = vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  window.requestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
    idleCallback = callback;
    return 7;
  });
  window.cancelIdleCallback = vi.fn();
  class IntersectionObserverDouble {
    root = null;
    rootMargin = '';
    thresholds = [0.05];
    constructor(callback: IntersectionObserverCallback) {
      intersectionCallback = callback;
    }
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
    takeRecords = vi.fn(() => []);
  }
  vi.stubGlobal('IntersectionObserver', IntersectionObserverDouble);
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    value: 'visible',
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('AdaptiveCanvas', () => {
  it('renders fallback when explicitly forced', () => {
    render(<AdaptiveCanvas section="arrival" forceFallback />);
    expect(screen.getByTestId('experience-fallback')).toBeVisible();
    expect(screen.queryByTestId('particle-canvas')).not.toBeInTheDocument();
  });

  it('renders fallback when WebGL is unavailable', () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);
    render(<AdaptiveCanvas section="arrival" />);
    expect(screen.getByTestId('experience-fallback')).toBeVisible();
    expect(screen.queryByTestId('particle-canvas')).not.toBeInTheDocument();
  });

  it('renders fallback when reduced motion is requested', () => {
    window.matchMedia = vi.fn((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    render(<AdaptiveCanvas section="arrival" />);
    expect(screen.getByTestId('experience-fallback')).toBeVisible();
    expect(screen.queryByTestId('particle-canvas')).not.toBeInTheDocument();
  });

  it('mounts the particle canvas only after idle and intersection', async () => {
    render(<AdaptiveCanvas section="arrival" />);
    expect(screen.queryByTestId('particle-canvas')).not.toBeInTheDocument();
    act(() => idleCallback?.({ didTimeout: false, timeRemaining: () => 10 }));
    act(() =>
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    await waitFor(() =>
      expect(screen.getByTestId('particle-canvas')).toBeVisible(),
    );
  });
});
