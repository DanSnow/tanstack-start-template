import { os } from '@orpc/server';
import { z } from 'zod';

import { oidcConfigured } from '~/lib/server/auth';

import { publicProcedure } from './orpc';

export const appRouter = os.router({
  greet: publicProcedure.input(z.object({ name: z.string() })).handler(({ input }) => `Hello ${input.name}!`),
  auth: {
    oidcConfigured: publicProcedure.handler(() => oidcConfigured),
  },
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
