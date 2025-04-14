import { createAPIFileRoute } from '@tanstack/react-start/api'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '~/server'

function handleRequest(request: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: () => ({}),
  })
}

export const APIRoute = createAPIFileRoute('/api/trpc/$')({
  GET: ({ request }) => {
    return handleRequest(request)
  },
  POST: async ({ request }) => {
    return handleRequest(request)
  },
})
