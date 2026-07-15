import type { SectionNavigationItem } from './navigation-types';

interface DesktopSectionRailProps {
  brand: string;
  navigationLabel: string;
  items: readonly SectionNavigationItem[];
  activeId: string;
}

export function DesktopSectionRail({
  brand,
  navigationLabel,
  items,
  activeId,
}: DesktopSectionRailProps) {
  return (
    <div className="desktop-section-rail">
      <span className="site-header__brand" aria-hidden="true">
        {brand}
      </span>
      <nav className="site-header__nav" aria-label={navigationLabel}>
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            aria-current={item.sectionId === activeId ? 'location' : undefined}
          >
            <span aria-hidden="true">{item.index}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
