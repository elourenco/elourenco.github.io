import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Locale } from '../content/schema';
import { persistLocale, resolveLocale } from './config';
import { parseLocalePath, toLocalePath } from './locale-paths';

export interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export function useLocale(): LocaleState {
  const location = useLocation();
  const navigate = useNavigate();
  const locale = useMemo(
    () => resolveLocale(location.pathname, navigator.language),
    [location.pathname],
  );

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      persistLocale(nextLocale);
      navigate(
        toLocalePath(nextLocale, parseLocalePath(location.pathname).route),
      );
    },
    [location.pathname, navigate],
  );

  return { locale, setLocale };
}
