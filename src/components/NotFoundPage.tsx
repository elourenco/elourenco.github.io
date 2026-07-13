import type { Locale } from '../content';
import { INTERNAL_DESTINATIONS, SITE_ANCHORS } from '../site-contract';

export function NotFoundPage({ locale }: { locale: Locale }) {
  const isPortuguese = locale === 'pt-BR';
  return (
    <main id={SITE_ANCHORS.main} data-locale={locale}>
      <h1>404</h1>
      <p>{isPortuguese ? 'Página não encontrada.' : 'Page not found.'}</p>
      <a href={INTERNAL_DESTINATIONS.route(locale, 'home')}>
        {isPortuguese ? 'Voltar ao início' : 'Back home'}
      </a>
      <a
        href={INTERNAL_DESTINATIONS.route(
          isPortuguese ? 'en' : 'pt-BR',
          'home',
        )}
      >
        {isPortuguese ? 'English' : 'Português'}
      </a>
    </main>
  );
}
