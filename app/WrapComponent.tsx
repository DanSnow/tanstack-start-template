import { QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'jotai'
import type { ReactNode } from 'react'
import type { Context } from './router-context'

export function WrapComponent({ children, context }: { children: ReactNode; context: Context }) {
  return (
    <context.trpc.Provider client={context.trpcClient} queryClient={context.queryClient}>
      <QueryClientProvider client={context.queryClient}>
        <Provider store={context.store}> {children}</Provider>
      </QueryClientProvider>
    </context.trpc.Provider>
  )
}
