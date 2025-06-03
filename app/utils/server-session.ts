import { createServerFn } from '@tanstack/react-start'
import { getHeaders } from '@tanstack/react-start/server'
import { auth } from '~/lib/server/auth'
import { pipe, Array } from 'effect'

/**
 * Get session on server side
 *
 * This function is intended to write as server function, so it can safely use in `loader`. As `loader` should be isomorphic.
 *
 * @returns session object
 */
export const getServerSession = createServerFn({
  method: 'GET',
}).handler(() => {
  const headers = getHeaders()
  return auth.api.getSession({
    headers: new Headers(
      pipe(
        headers,
        Object.entries,
        Array.filter((pair): pair is [string, string] => pair[1] !== undefined),
      ),
    ),
  })
})
