import type { PortfolioContent, RouteKey } from '../content';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  HOME_SECTION_ANCHORS,
  INTERNAL_DESTINATIONS,
  SITE_ANCHORS,
} from '../site-contract';

export interface SiteHeaderProps {
  content: PortfolioContent;
  route: RouteKey;
}

export function SiteHeader({ content, route }: SiteHeaderProps) {
  const isPortuguese = content.locale === 'pt-BR';
  const homePath = INTERNAL_DESTINATIONS.route(content.locale, 'home');
  const isHome = route === 'home';
  const labels = {
    expertise: content.navigation.expertise,
    work: content.navigation.work,
    career: content.navigation.career,
    contact: content.navigation.contact,
  };
  const links = [
    ...HOME_SECTION_ANCHORS.map((id) => [id, labels[id]] as const),
  ] as const;

  return (
    <header className="site-header">
      <a
        className="site-header__brand"
        href={
          isHome ? INTERNAL_DESTINATIONS.fragment(SITE_ANCHORS.main) : homePath
        }
        aria-label={isPortuguese ? 'Início' : 'Home'}
      >
        {content.hero.eyebrow}
      </a>
      <nav
        className="site-header__nav"
        aria-label={isPortuguese ? 'Navegação principal' : 'Primary'}
      >
        {links.map(([id, label]) => (
          <a
            key={id}
            href={
              isHome
                ? INTERNAL_DESTINATIONS.fragment(id)
                : INTERNAL_DESTINATIONS.routeFragment(
                    content.locale,
                    'home',
                    id,
                  )
            }
          >
            {label}
          </a>
        ))}
      </nav>
      <LanguageSwitcher route={route} />
    </header>
  );
}
