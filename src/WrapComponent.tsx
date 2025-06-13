import { QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'jotai'
import type { ReactNode } from 'react'
import type { Context } from './router-context'

export function WrapComponent({ children, context }: { children: ReactNode; context: Context }) {
  return (
    <QueryClientProvider client={context.queryClient}>
      <Provider store={context.store}>{children}</Provider>
    </QueryClientProvider>
  )
}
