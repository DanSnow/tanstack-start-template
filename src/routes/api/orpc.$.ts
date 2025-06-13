import { onError } from '@orpc/server';
import { RPCHandler } from '@orpc/server/fetch';
import { createServerFileRoute } from '@tanstack/react-start/server';
import { appRouter } from '~/server';

const handler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error('Server error:', error);
    }),
  ],
});

async function handleRequest(request: Request) {
  const res = await handler.handle(request, {
    prefix: '/api/orpc',
  });
  if (res.matched) {
    return res.response;
  }

  return new Response('Not found', { status: 404 });
}

export const ServerRoute = createServerFileRoute('/api/orpc/$').methods({
  GET: ({ request }) => {
    return handleRequest(request);
  },
  POST: async ({ request }) => {
    return handleRequest(request);
  },
});
