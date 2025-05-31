import { createAPIFileRoute } from '@tanstack/react-start/api'
import { RPCHandler } from '@orpc/server/fetch'
import { appRouter } from '~/server'
import { onError } from '@orpc/server'

const handler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error('Server error:', error)
    }),
  ],
})

async function handleRequest(request: Request) {
  const res = await handler.handle(request, {
    prefix: '/api/orpc',
  })
  if (res.matched) {
    return res.response
  }

  return new Response('Not found', { status: 404 })
}

export const APIRoute = createAPIFileRoute('/api/orpc/$')({
  GET: ({ request }) => {
    return handleRequest(request)
  },
  POST: async ({ request }) => {
    return handleRequest(request)
  },
})
