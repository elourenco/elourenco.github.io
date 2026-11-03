import { useLayoutEffect, useRef } from 'react';
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

export function RouteLayout() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef(pathname);

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (navigationType === 'POP') return;
    const section = hash ? document.getElementById(hash.slice(1)) : null;
    const heading =
      section?.querySelector<HTMLElement>('h1, h2') ??
      section ??
      document.querySelector<HTMLElement>('main h1');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, [pathname, hash, navigationType]);

  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
