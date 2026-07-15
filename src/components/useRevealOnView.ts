import { useEffect, useRef, useState } from 'react';

function shouldRevealImmediately(): boolean {
  if (typeof window === 'undefined') return true;
  if (typeof IntersectionObserver === 'undefined') return true;
  return (
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  );
}

export function useRevealOnView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(shouldRevealImmediately);

  useEffect(() => {
    if (revealed) return;
    const element = ref.current;
    if (!element) {
      setRevealed(true);
      return;
    }

    let disconnected = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        disconnect();
        setRevealed(true);
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    const disconnect = () => {
      if (disconnected) return;
      disconnected = true;
      observer.disconnect();
    };
    observer.observe(element);
    return disconnect;
  }, [revealed]);

  return { ref, revealed };
}
