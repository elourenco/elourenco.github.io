import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useExperienceGate } from './useExperienceGate';

let idleCallback: IdleRequestCallback | undefined;
let intersectionCallback: IntersectionObserverCallback | undefined;
const disconnect = vi.fn();

beforeEach(() => {
  idleCallback = undefined;
  intersectionCallback = undefined;
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
    disconnect = disconnect;
    unobserve = vi.fn();
    takeRecords = vi.fn(() => []);
  }
  vi.stubGlobal('IntersectionObserver', IntersectionObserverDouble);
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    value: 'visible',
  });
  disconnect.mockClear();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('useExperienceGate', () => {
  it('keeps ineligible experiences closed', () => {
    const target = { current: document.createElement('div') };
    const { result } = renderHook(() =>
      useExperienceGate({ eligible: false, target }),
    );
    expect(result.current).toEqual({ ready: false, visible: false });
    expect(window.requestIdleCallback).not.toHaveBeenCalled();
  });

  it('opens progressively after idle and intersection and follows document visibility', () => {
    const target = { current: document.createElement('div') };
    const { result } = renderHook(() =>
      useExperienceGate({ eligible: true, target }),
    );
    expect(result.current).toEqual({ ready: false, visible: false });
    act(() => idleCallback?.({ didTimeout: false, timeRemaining: () => 10 }));
    expect(result.current.ready).toBe(true);
    act(() =>
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    expect(result.current.visible).toBe(true);
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'hidden',
    });
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(result.current.visible).toBe(false);
  });

  it('cancels pending work and disconnects observation on unmount', () => {
    const target = { current: document.createElement('div') };
    const { unmount } = renderHook(() =>
      useExperienceGate({ eligible: true, target }),
    );
    unmount();
    expect(window.cancelIdleCallback).toHaveBeenCalledWith(7);
    expect(disconnect).toHaveBeenCalledOnce();
  });

  it('requires fresh idle and intersection signals after reactivation', () => {
    const target = { current: document.createElement('div') };
    const { result, rerender } = renderHook(
      ({ eligible }) => useExperienceGate({ eligible, target }),
      { initialProps: { eligible: true } },
    );

    act(() => idleCallback?.({ didTimeout: false, timeRemaining: () => 10 }));
    act(() =>
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    expect(result.current).toEqual({ ready: true, visible: true });

    rerender({ eligible: false });
    expect(result.current).toEqual({ ready: false, visible: false });

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'hidden',
    });
    rerender({ eligible: true });
    expect(result.current).toEqual({ ready: false, visible: false });
    expect(window.requestIdleCallback).toHaveBeenCalledTimes(2);

    act(() => idleCallback?.({ didTimeout: false, timeRemaining: () => 10 }));
    act(() =>
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    expect(result.current).toEqual({ ready: true, visible: false });
  });
});
