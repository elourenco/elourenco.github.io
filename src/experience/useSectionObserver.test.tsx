import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSectionObserver } from './useSectionObserver';

let intersectionCallback: IntersectionObserverCallback;
const disconnect = vi.fn();

class IntersectionObserverStub {
  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  observe = vi.fn();
  disconnect = disconnect;
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = '0px';
  thresholds = [0.25, 0.5, 0.7];
}

function entry(
  target: Element,
  intersectionRatio: number,
): IntersectionObserverEntry {
  return {
    target,
    isIntersecting: intersectionRatio > 0,
    intersectionRatio,
  } as IntersectionObserverEntry;
}

describe('useSectionObserver', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<section id="arrival"></section><section id="ai-core"></section>';
    disconnect.mockClear();
    vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('selects the intersecting section with the largest ratio', () => {
    const arrival = document.querySelector('#arrival')!;
    const aiCore = document.querySelector('#ai-core')!;
    const { result } = renderHook(() =>
      useSectionObserver(['arrival', 'ai-core']),
    );

    act(() =>
      intersectionCallback(
        [entry(arrival, 0.4), entry(aiCore, 0.7)],
        {} as IntersectionObserver,
      ),
    );

    expect(result.current).toBe('ai-core');
  });

  it('uses declaration order to break equal-ratio ties', () => {
    const arrival = document.querySelector('#arrival')!;
    const aiCore = document.querySelector('#ai-core')!;
    const { result } = renderHook(() =>
      useSectionObserver(['arrival', 'ai-core']),
    );

    act(() =>
      intersectionCallback(
        [entry(aiCore, 0.7), entry(arrival, 0.7)],
        {} as IntersectionObserver,
      ),
    );

    expect(result.current).toBe('arrival');
  });

  it('retains the prior section when none intersects and disconnects on unmount', () => {
    const aiCore = document.querySelector('#ai-core')!;
    const { result, unmount } = renderHook(() =>
      useSectionObserver(['arrival', 'ai-core']),
    );

    act(() =>
      intersectionCallback([entry(aiCore, 0.7)], {} as IntersectionObserver),
    );
    act(() =>
      intersectionCallback([entry(aiCore, 0)], {} as IntersectionObserver),
    );

    expect(result.current).toBe('ai-core');
    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
