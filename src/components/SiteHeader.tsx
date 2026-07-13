import type { PortfolioContent, RouteKey } from '../content';
import { LanguageSwitcher } from './LanguageSwitcher';

export function SiteHeader({
  content,
  route,
}: {
  content: PortfolioContent;
  route: RouteKey;
}) {
  const isPortuguese = content.locale === 'pt-BR';
  const links = [
    ['expertise', content.navigation.expertise],
    ['work', content.navigation.work],
    ['career', content.navigation.career],
    ['contact', content.navigation.contact],
  ] as const;

  return (
    <header>
      <a href="#main-content" aria-label={isPortuguese ? 'Início' : 'Home'}>
        {content.hero.eyebrow}
      </a>
      <nav aria-label={isPortuguese ? 'Navegação principal' : 'Primary'}>
        {links.map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <LanguageSwitcher route={route} />
    </header>
  );
}
