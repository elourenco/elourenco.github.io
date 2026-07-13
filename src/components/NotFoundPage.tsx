import type { Locale } from '../content';
import { toLocalePath } from '../i18n/locale-paths';

export function NotFoundPage({ locale }: { locale: Locale }) {
  const isPortuguese = locale === 'pt-BR';
  return (
    <main id="main-content" data-locale={locale}>
      <h1>404</h1>
      <p>{isPortuguese ? 'Página não encontrada.' : 'Page not found.'}</p>
      <a href={toLocalePath(locale, 'home')}>
        {isPortuguese ? 'Voltar ao início' : 'Back home'}
      </a>
      <a href={toLocalePath(isPortuguese ? 'en' : 'pt-BR', 'home')}>
        {isPortuguese ? 'English' : 'Português'}
      </a>
    </main>
  );
}
