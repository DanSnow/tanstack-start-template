import { onError } from '@orpc/server';
import { RPCHandler } from '@orpc/server/fetch';
import { createFileRoute } from '@tanstack/react-router';
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

export const Route = createFileRoute('/api/orpc/$')({
  server: {
    handlers: {
      GET: ({ request }) => {
        return handleRequest(request);
      },
      POST: async ({ request }) => {
        return handleRequest(request);
      },
    },
  },
});
