import { Link } from 'react-router-dom';
import type { RouteKey } from '../content';
import { toLocalePath } from '../i18n/locale-paths';
import { useLocale } from '../i18n/useLocale';

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
          to={toLocalePath(nextLocale, route)}
          onClick={() => setLocale(nextLocale)}
        >
          {nextLocale === 'en' ? 'EN' : 'PT-BR'}
        </Link>
      ))}
    </nav>
  );
}
