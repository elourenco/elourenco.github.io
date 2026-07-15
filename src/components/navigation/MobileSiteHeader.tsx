import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { SectionNavigationItem } from './navigation-types';

interface MobileSiteHeaderProps {
  brand: string;
  navigationLabel: string;
  openLabel: string;
  closeLabel: string;
  items: readonly SectionNavigationItem[];
}

export function MobileSiteHeader({
  brand,
  navigationLabel,
  openLabel,
  closeLabel,
  items,
}: MobileSiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigationId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  function closeNavigation() {
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Escape' || !isOpen) return;

    event.preventDefault();
    closeNavigation();
    toggleRef.current?.focus();
  }

  return (
    <div className="mobile-site-header" onKeyDown={handleKeyDown}>
      <span className="site-header__brand" aria-hidden="true">
        {brand}
      </span>
      <button
        ref={toggleRef}
        type="button"
        className="mobile-site-header__toggle"
        aria-expanded={isOpen}
        aria-controls={navigationId}
        aria-label={isOpen ? closeLabel : openLabel}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true">{isOpen ? '×' : '☰'}</span>
      </button>
      {isOpen ? (
        <nav
          id={navigationId}
          className="site-header__nav"
          aria-label={navigationLabel}
        >
          {items.map((item) => (
            <a key={item.href} href={item.href} onClick={closeNavigation}>
              <span aria-hidden="true">{item.index}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
