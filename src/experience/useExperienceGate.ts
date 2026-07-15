import { useEffect, useMemo, useState, type RefObject } from 'react';

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
  const activation = useMemo(() => ({ eligible }), [eligible]);
  const [readyActivation, setReadyActivation] = useState<object | null>(null);
  const [intersection, setIntersection] = useState<{
    activation: object | null;
    value: boolean;
  }>({ activation: null, value: false });
  const [visibility, setVisibility] = useState<{
    activation: object | null;
    value: boolean;
  }>({ activation: null, value: document.visibilityState === 'visible' });

  useEffect(() => {
    if (!eligible) {
      return;
    }

    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    const markReady = () => setReadyActivation(activation);
    if (typeof window.requestIdleCallback === 'function')
      idleHandle = window.requestIdleCallback(markReady, { timeout: 1200 });
    else timeoutHandle = setTimeout(markReady, 400);

    const observer = new IntersectionObserver(
      ([entry]) =>
        setIntersection({
          activation,
          value: Boolean(entry?.isIntersecting),
        }),
      { threshold: 0.05 },
    );
    if (target.current) observer.observe(target.current);
    const onVisibilityChange = () =>
      setVisibility({
        activation,
        value: document.visibilityState === 'visible',
      });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
      if (timeoutHandle !== undefined) clearTimeout(timeoutHandle);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      observer.disconnect();
    };
  }, [activation, eligible, target]);

  const ready = readyActivation === activation;
  const intersecting =
    intersection.activation === activation && intersection.value;
  const documentVisible =
    visibility.activation === activation
      ? visibility.value
      : document.visibilityState === 'visible';

  return eligible
    ? { ready, visible: intersecting && documentVisible }
    : { ready: false, visible: false };
}
