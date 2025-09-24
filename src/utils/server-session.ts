import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { auth } from '~/lib/server/auth';

/**
 * Get session on server side
 *
 * This function is intended to write as server function, so it can safely use in `loader`. As `loader` should be isomorphic.
 *
 * @returns session object
 */
export const getServerSession = createServerFn({
  method: 'GET',
}).handler(async () => {
  const headers = getRequestHeaders();
  const res = await auth.api.getSession({
    headers,
  });

  if (!res) {
    return null;
  }

  return {
    session: res.session,
    user: res.user,
  };
});
