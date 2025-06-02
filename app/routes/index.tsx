import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useCallback } from 'react'
import { Button } from '~/components/ui/button'
import { authClient } from '~/lib/auth-client'

export const Route = createFileRoute('/')({
  component: Home,
  loader: ({ context: { orpc, queryClient } }) => {
    return queryClient.ensureQueryData(
      orpc.greet.queryOptions({
        input: {
          name: 'World',
        },
      }),
    )
  },
})

const hello = createServerFn({
  method: 'POST',
}).handler(() => {
  return 'Hello World!'
})

function Home() {
  const data = Route.useLoaderData()
  const { data: session } = authClient.useSession()
  const handleClick = useCallback(async () => {
    const res = await hello()
    console.log(res)
  }, [])
  return (
    <div className="p-2">
      <h3>{data}</h3>
      <p>{session ? `Hi ${session.user.name}` : 'Not Login'}</p>
      <Button onClick={handleClick}>Click Me!</Button>
    </div>
  )
}
