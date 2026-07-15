import { useEffect, useState } from 'react';

export function useActiveSection(
  ids: readonly string[],
  enabled: boolean,
): string {
  const [activeId, setActiveId] = useState(ids[0] ?? '');
  const idKey = ids.join('\u0000');

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return;

    const visible = new Map<string, number>();
    const elements = idKey
      .split('\u0000')
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) visible.set(id, entry.intersectionRatio);
          else visible.delete(id);
        }
        const next = [...visible.entries()].sort(
          ([, left], [, right]) => right - left,
        )[0]?.[0];
        if (next) setActiveId(next);
      },
      {
        rootMargin: '-18% 0px -58% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [enabled, idKey]);

  return activeId;
}
