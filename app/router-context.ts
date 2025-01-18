import { QueryClient } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { createTRPCReact, createTRPCQueryUtils } from '@trpc/react-query'
import { createStore } from 'jotai'
import type { AppRouter } from './server'

const HOST_URL = 'http://localhost:3000'

export function createRouterContext() {
  const queryClient = new QueryClient()

  const trpc = createTRPCReact<AppRouter>({})

  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: `${HOST_URL}/api/trpc`,
      }),
    ],
  })

  const trpcQueryUtils = createTRPCQueryUtils({
    queryClient,
    client: trpcClient,
  })

  const store = createStore()

  return {
    queryClient,
    trpc,
    trpcClient,
    trpcQueryUtils,
    store,
  }
}

export type Context = ReturnType<typeof createRouterContext>
