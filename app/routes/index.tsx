import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { useCallback } from 'react'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/')({
  component: Home,
  loader: ({ context: { trpcQueryUtils } }) => {
    return trpcQueryUtils.greet.ensureData({ name: 'World' })
  },
})

const hello = createServerFn({
  method: 'POST',
}).handler(() => {
  return 'Hello World!'
})

function Home() {
  const data = Route.useLoaderData()
  const handleClick = useCallback(async () => {
    const res = await hello()
    console.log(res)
  }, [])
  return (
    <div className="p-2">
      <h3>{data}</h3>
      <Button onClick={handleClick}>Click Me!</Button>
    </div>
  )
}
