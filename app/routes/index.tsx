import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/')({
  component: Home,
  loader: ({ context: { trpcQueryUtils } }) => {
    return trpcQueryUtils.greet.ensureData({ name: 'World' })
  },
})

function Home() {
  const data = Route.useLoaderData()
  return (
    <div className="p-2">
      <h3>{data}</h3>
      <Button>Click Me!</Button>
    </div>
  )
}
