import { os, ORPCError } from '@orpc/server';
import { auth } from '~/lib/server/auth';

export const publicProcedure = os;

export const authedProcedure = os.$context<{ headers: Headers }>().use(async ({ context, next }) => {
  const session = await auth.api.getSession({
    headers: context.headers,
  });
  if (!session) {
    throw new ORPCError('UNAUTHORIZED');
  }
  return next({ context: { ...context, session } });
});
