import { useEffect, useState } from 'react';

const THRESHOLDS = [0.25, 0.5, 0.7];

export function useSectionObserver<const SectionId extends string>(
  sectionIds: readonly SectionId[],
): SectionId {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);
  const sectionKey = JSON.stringify(sectionIds);

  useEffect(() => {
    const observedIds = JSON.parse(sectionKey) as SectionId[];
    const ratios = new Map<SectionId, number>();
    const elements = observedIds.flatMap((id) => {
      const element = document.getElementById(id);
      return element ? [element] : [];
    });

    if (elements.length === 0 || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(
            entry.target.id as SectionId,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        const nextSection = observedIds.reduce<SectionId | undefined>(
          (selected, id) => {
            if ((ratios.get(id) ?? 0) <= 0) return selected;
            if (!selected) return id;
            return (ratios.get(id) ?? 0) > (ratios.get(selected) ?? 0)
              ? id
              : selected;
          },
          undefined,
        );

        if (nextSection) setActiveSection(nextSection);
      },
      { threshold: THRESHOLDS },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [sectionKey]);

  return activeSection;
}
