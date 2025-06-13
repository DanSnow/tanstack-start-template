import { QueryClient } from '@tanstack/react-query'
import { RPCLink } from '@orpc/client/fetch'
import type { RouterClient } from '@orpc/server'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { createStore } from 'jotai'
import type { AppRouter } from './server'
import { createORPCClient } from '@orpc/client'

const HOST_URL = 'http://localhost:3000'

export function createRouterContext() {
  const queryClient = new QueryClient()

  const orpcClient: RouterClient<AppRouter> = createORPCClient(
    new RPCLink({
      url:
        typeof window !== 'undefined' ? new URL('/api/orpc', window.location.origin) : new URL('/api/orpc', HOST_URL),
    }),
  )

  const orpc = createTanstackQueryUtils(orpcClient)

  const store = createStore()

  return {
    queryClient,
    orpcClient,
    orpc,
    store,
  }
}

export type Context = ReturnType<typeof createRouterContext>
