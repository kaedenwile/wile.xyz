import { createRootRouteWithContext, Outlet, useMatches } from '@tanstack/react-router';
import { useEffect } from 'react';
import { NotFound } from '../home/NotFound.tsx';

export interface RouteContext {
  title?: string;
  bodyClass?: string;
}

export const Route = createRootRouteWithContext<RouteContext>()({
  beforeLoad: () => ({ title: 'wile.xyz' }),
  component: Root,
  notFoundComponent: NotFound,
});

function Root() {
  const matches = useMatches();

  useEffect(() => {
    document.title =
      [...matches]
        .reverse()
        .map((d) => d.context.title)
        .find(Boolean) || 'wile.xyz';

    document.body.className =
      [...matches]
        .reverse()
        .map((d) => d.context.bodyClass)
        .find(Boolean) || 'home';
  }, [matches]);

  return (
    <>
      <Outlet />
      {/*<TanStackRouterDevtools />*/}
    </>
  );
}
