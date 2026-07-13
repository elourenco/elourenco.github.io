import { createElement } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { getContent } from '../content';
import type { Locale } from '../content';
import { resolveLocale } from '../i18n/config';
import { toLocalePath } from '../i18n/locale-paths';

function RootRedirect() {
  const locale = resolveLocale('/', navigator.language);
  return createElement(Navigate, {
    replace: true,
    to: toLocalePath(locale, 'home'),
  });
}

function LocalizedPage({
  locale,
  page,
}: {
  locale: Locale;
  page: 'home' | 'donaEvents';
}) {
  const content = getContent(locale);
  return createElement(
    'main',
    { id: 'main-content', 'data-locale': locale, 'data-page': page },
    createElement(
      'h1',
      null,
      page === 'home' ? content.hero.title : content.dona.title,
    ),
  );
}

function LocalizedNotFound({ locale }: { locale: Locale }) {
  return createElement(
    'main',
    { id: 'main-content', 'data-locale': locale },
    createElement('h1', null, '404'),
    createElement(
      'p',
      null,
      locale === 'pt-BR' ? 'Página não encontrada.' : 'Page not found.',
    ),
    createElement(
      'a',
      { href: toLocalePath(locale, 'home') },
      locale === 'pt-BR' ? 'Voltar ao início' : 'Back home',
    ),
  );
}

const page = (locale: Locale, route: 'home' | 'donaEvents') =>
  createElement(LocalizedPage, { locale, page: route });
const notFound = (locale: Locale) =>
  createElement(LocalizedNotFound, { locale });

export const router = createBrowserRouter([
  { path: '/', element: createElement(RootRedirect) },
  { path: '/en', element: page('en', 'home') },
  { path: '/en/projects/dona-events', element: page('en', 'donaEvents') },
  { path: '/pt-br', element: page('pt-BR', 'home') },
  {
    path: '/pt-br/projetos/dona-events',
    element: page('pt-BR', 'donaEvents'),
  },
  { path: '/pt-br/*', element: notFound('pt-BR') },
  { path: '*', element: notFound('en') },
]);
