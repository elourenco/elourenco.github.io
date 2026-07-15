import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useRevealOnView } from './useRevealOnView';

let callback: IntersectionObserverCallback | undefined;
let observer: IntersectionObserver;
let disconnect = vi.fn<() => void>();

function Probe() {
  const { ref, revealed } = useRevealOnView<HTMLDivElement>();
  return <div ref={ref}>{revealed ? 'revealed' : 'hidden'}</div>;
}

function mediaQuery(matches: boolean): MediaQueryList {
  return {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
}

beforeEach(() => {
  disconnect = vi.fn<() => void>();
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mediaQuery(false)),
  );
  observer = {
    root: null,
    rootMargin: '',
    thresholds: [],
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect,
    takeRecords: () => [],
  };
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function ObserverMock(next: IntersectionObserverCallback) {
      callback = next;
      return observer;
    }),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it('reveals once when the target intersects', () => {
  render(<Probe />);
  expect(screen.getByText('hidden')).toBeVisible();
  act(() =>
    callback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      observer,
    ),
  );
  expect(screen.getByText('revealed')).toBeVisible();
  expect(disconnect).toHaveBeenCalledOnce();
});

it('starts revealed when reduced motion is requested', () => {
  vi.mocked(window.matchMedia).mockReturnValue(mediaQuery(true));
  render(<Probe />);
  expect(screen.getByText('revealed')).toBeVisible();
});

it('starts revealed when IntersectionObserver is unavailable', () => {
  vi.stubGlobal('IntersectionObserver', undefined);
  render(<Probe />);
  expect(screen.getByText('revealed')).toBeVisible();
});
