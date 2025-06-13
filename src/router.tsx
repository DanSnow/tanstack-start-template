import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary';
import { NotFound } from './components/NotFound';
import { routeTree } from './routeTree.gen';
import { createRouterContext } from './router-context';

export function createRouter() {
  const context = createRouterContext();

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  });

  return routerWithQueryClient(router, context.queryClient);
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
