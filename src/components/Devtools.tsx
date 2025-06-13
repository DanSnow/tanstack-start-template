import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useRouteContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { DevTools } from 'jotai-devtools'
import { useEffect, useState } from 'react'

function Devtools() {
  const { queryClient, store } = useRouteContext({ from: '__root__' })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    mounted && (
      <>
        <ReactQueryDevtools client={queryClient} />
        <DevTools store={store} />
        <TanStackRouterDevtools position="bottom-right" />
      </>
    )
  )
}

Devtools.displayName = 'Devtools'

export default Devtools
