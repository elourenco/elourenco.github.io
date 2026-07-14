import { useEffect, useState, type RefObject } from 'react';

export interface ExperienceGateInput {
  eligible: boolean;
  target: RefObject<Element | null>;
}
export interface ExperienceGateState {
  ready: boolean;
  visible: boolean;
}

export function useExperienceGate({
  eligible,
  target,
}: ExperienceGateInput): ExperienceGateState {
  const [ready, setReady] = useState(false);
  const [intersecting, setIntersecting] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(
    () => document.visibilityState === 'visible',
  );

  useEffect(() => {
    if (!eligible) {
      return;
    }

    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    const markReady = () => setReady(true);
    if (typeof window.requestIdleCallback === 'function')
      idleHandle = window.requestIdleCallback(markReady, { timeout: 1200 });
    else timeoutHandle = setTimeout(markReady, 400);

    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(Boolean(entry?.isIntersecting)),
      { threshold: 0.05 },
    );
    if (target.current) observer.observe(target.current);
    const onVisibilityChange = () =>
      setDocumentVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
      if (timeoutHandle !== undefined) clearTimeout(timeoutHandle);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      observer.disconnect();
    };
  }, [eligible, target]);

  return eligible
    ? { ready, visible: intersecting && documentVisible }
    : { ready: false, visible: false };
}
