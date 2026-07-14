import type { Locale } from '../content';
import { INTERNAL_DESTINATIONS, SITE_ANCHORS } from '../site-contract';

export function NotFoundPage({ locale }: { locale: Locale }) {
  const isPortuguese = locale === 'pt-BR';
  return (
    <main id={SITE_ANCHORS.main} className="not-found" data-locale={locale}>
      <h1 className="not-found__code">404</h1>
      <p className="not-found__message">
        {isPortuguese ? 'Página não encontrada.' : 'Page not found.'}
      </p>
      <div className="not-found__actions">
        <a
          className="not-found__link button button--primary"
          href={INTERNAL_DESTINATIONS.route(locale, 'home')}
        >
          {isPortuguese ? 'Voltar ao início' : 'Back home'}
        </a>
        <a
          className="not-found__link button"
          href={INTERNAL_DESTINATIONS.route(
            isPortuguese ? 'en' : 'pt-BR',
            'home',
          )}
        >
          {isPortuguese ? 'English' : 'Português'}
        </a>
      </div>
    </main>
  );
}
