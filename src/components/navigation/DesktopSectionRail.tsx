import { CircleIcon, MinusIcon, WaveformIcon } from '@phosphor-icons/react';
import type { SectionNavigationItem } from './navigation-types';

interface DesktopSectionRailProps {
  navigationLabel: string;
  items: readonly SectionNavigationItem[];
  activeId: string;
}

export function DesktopSectionRail({
  navigationLabel,
  items,
  activeId,
}: DesktopSectionRailProps) {
  return (
    <div className="desktop-section-rail">
      <nav className="site-header__nav" aria-label={navigationLabel}>
        {items.map((item) => {
          const current = item.sectionId === activeId;

          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={current ? 'location' : undefined}
            >
              <CircleIcon
                className="desktop-section-rail__node"
                aria-hidden="true"
                size={14}
                weight={current ? 'fill' : 'regular'}
              />
              <span className="desktop-section-rail__label">
                <span aria-hidden="true">{item.index}</span>
                <span>{item.label}</span>
              </span>
            </a>
          );
        })}
      </nav>
      <span className="desktop-section-rail__footer" aria-hidden="true">
        <MinusIcon size={22} weight="bold" />
        <WaveformIcon size={28} weight="regular" />
      </span>
    </div>
  );
}
