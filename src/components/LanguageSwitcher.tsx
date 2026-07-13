import { Link } from 'react-router-dom';
import type { RouteKey } from '../content';
import { useLocale } from '../i18n/useLocale';
import { INTERNAL_DESTINATIONS } from '../site-contract';

export function LanguageSwitcher({ route }: { route: RouteKey }) {
  const { locale, setLocale } = useLocale();

  return (
    <nav
      className="language-switcher"
      aria-label={locale === 'pt-BR' ? 'Idioma' : 'Language'}
    >
      {(['en', 'pt-BR'] as const).map((nextLocale) => (
        <Link
          key={nextLocale}
          lang={nextLocale}
          aria-current={locale === nextLocale ? 'page' : undefined}
          to={INTERNAL_DESTINATIONS.route(nextLocale, route)}
          onClick={() => setLocale(nextLocale)}
        >
          {nextLocale === 'en' ? 'EN' : 'PT-BR'}
        </Link>
      ))}
    </nav>
  );
}
