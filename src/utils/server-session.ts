import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { auth } from '~/lib/server/auth';
import { authClient } from '~/lib/auth-client';

export const getSession = createIsomorphicFn()
  .server(async () => {
    const res = await auth.api.getSession({ headers: getRequestHeaders() });
    if (!res) return null;
    return { session: res.session, user: res.user };
  })
  .client(async () => {
    const res = await authClient.getSession();
    return res.data ?? null;
  });
