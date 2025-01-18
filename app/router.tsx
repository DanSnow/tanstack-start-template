import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary'
import { NotFound } from './components/NotFound'
import { createRouterContext } from './router-context'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'

export function createRouter() {
  const context = createRouterContext()

  const router = createTanStackRouter({
    routeTree,
    context,
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  })

  return routerWithQueryClient(router, context.queryClient)
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
