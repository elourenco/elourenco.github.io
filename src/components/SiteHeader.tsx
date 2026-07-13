import type { PortfolioContent, RouteKey } from '../content';
import { toLocalePath } from '../i18n/locale-paths';
import { LanguageSwitcher } from './LanguageSwitcher';

export interface SiteHeaderProps {
  content: PortfolioContent;
  route: RouteKey;
}

export function SiteHeader({ content, route }: SiteHeaderProps) {
  const isPortuguese = content.locale === 'pt-BR';
  const homePath = toLocalePath(content.locale, 'home');
  const isHome = route === 'home';
  const links = [
    ['expertise', content.navigation.expertise],
    ['work', content.navigation.work],
    ['career', content.navigation.career],
    ['contact', content.navigation.contact],
  ] as const;

  return (
    <header>
      <a
        href={isHome ? '#main-content' : homePath}
        aria-label={isPortuguese ? 'Início' : 'Home'}
      >
        {content.hero.eyebrow}
      </a>
      <nav aria-label={isPortuguese ? 'Navegação principal' : 'Primary'}>
        {links.map(([id, label]) => (
          <a key={id} href={isHome ? `#${id}` : `${homePath}#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <LanguageSwitcher route={route} />
    </header>
  );
}
