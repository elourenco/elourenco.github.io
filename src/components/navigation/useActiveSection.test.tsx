import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useActiveSection } from './useActiveSection';

const ids = ['home', 'work'] as const;
let callback: IntersectionObserverCallback | undefined;
let disconnect = vi.fn<() => void>();

function Probe() {
  const activeId = useActiveSection(ids, true);
  return (
    <>
      <section id="home" />
      <section id="work" />
      <output>{activeId}</output>
    </>
  );
}

beforeEach(() => {
  disconnect = vi.fn<() => void>();
  class ObserverMock implements IntersectionObserver {
    constructor(next: IntersectionObserverCallback) {
      callback = next;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = disconnect;
    root = null;
    rootMargin = '';
    thresholds = [];
    takeRecords = () => [];
  }
  vi.stubGlobal('IntersectionObserver', ObserverMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it('tracks the strongest visible section and disconnects', () => {
  const view = render(<Probe />);
  expect(screen.getByText('home')).toBeVisible();

  act(() => {
    callback?.(
      [
        {
          target: document.getElementById('work')!,
          isIntersecting: true,
          intersectionRatio: 0.75,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );
  });

  expect(screen.getByText('work')).toBeVisible();
  view.unmount();
  expect(disconnect).toHaveBeenCalledOnce();
});
