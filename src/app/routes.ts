import { createElement } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { getContent } from '../content';
import type { Locale } from '../content';
import { HomePage } from '../features/home/HomePage';
import { DonaEventsPage } from '../features/projects/DonaEventsPage';
import { resolveLocale } from '../i18n/config';
import { toLocalePath } from '../i18n/locale-paths';
import { NotFoundPage } from '../components/NotFoundPage';

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
  if (page === 'home') {
    return createElement(HomePage, { content });
  }

  return createElement(DonaEventsPage, { content });
}

const page = (locale: Locale, route: 'home' | 'donaEvents') =>
  createElement(LocalizedPage, { locale, page: route });
const notFound = (locale: Locale) => createElement(NotFoundPage, { locale });

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
