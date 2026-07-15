import type { PortfolioContent, RouteKey } from '../content';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  HOME_NAVIGATION_ANCHORS,
  HOME_SECTION_ANCHORS,
  INTERNAL_DESTINATIONS,
  SITE_ANCHORS,
} from '../site-contract';
import { DesktopSectionRail } from './navigation/DesktopSectionRail';
import { MobileSiteHeader } from './navigation/MobileSiteHeader';
import { useActiveSection } from './navigation/useActiveSection';

export interface SiteHeaderProps {
  content: PortfolioContent;
  route: RouteKey;
}

export function SiteHeader({ content, route }: SiteHeaderProps) {
  const isPortuguese = content.locale === 'pt-BR';
  const homePath = INTERNAL_DESTINATIONS.route(content.locale, 'home');
  const isHome = route === 'home';
  const activeId = useActiveSection(HOME_NAVIGATION_ANCHORS, isHome);
  const navigationActiveId = isHome ? activeId : '';
  const labels = {
    expertise: content.navigation.expertise,
    work: content.navigation.work,
    career: content.navigation.career,
    contact: content.navigation.contact,
  };
  const homeHref = isHome
    ? INTERNAL_DESTINATIONS.fragment(SITE_ANCHORS.home.hero)
    : homePath;
  const items = [
    {
      index: '01',
      label: isPortuguese ? 'Início' : 'Home',
      href: homeHref,
      sectionId: SITE_ANCHORS.home.hero,
    },
    ...HOME_SECTION_ANCHORS.map((id, offset) => ({
      index: String(offset + 2).padStart(2, '0'),
      label: labels[id],
      sectionId: id,
      href: isHome
        ? INTERNAL_DESTINATIONS.fragment(id)
        : INTERNAL_DESTINATIONS.routeFragment(content.locale, 'home', id),
    })),
  ] as const;
  const navigationLabel = isPortuguese ? 'Navegação principal' : 'Primary';

  return (
    <header className="site-header">
      <DesktopSectionRail
        navigationLabel={navigationLabel}
        items={items}
        activeId={navigationActiveId}
      />
      <MobileSiteHeader
        brand={content.hero.eyebrow}
        navigationLabel={navigationLabel}
        openLabel={isPortuguese ? 'Abrir navegação' : 'Open navigation'}
        closeLabel={isPortuguese ? 'Fechar navegação' : 'Close navigation'}
        items={items}
        activeId={navigationActiveId}
      />
      <LanguageSwitcher route={route} />
    </header>
  );
}
