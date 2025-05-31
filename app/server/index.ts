import { z } from 'zod'
import { os } from '@orpc/server'
import { publicProcedure } from './orpc'

export const appRouter = os.router({
  greet: publicProcedure.input(z.object({ name: z.string() })).handler(({ input }) => `Hello ${input.name}!`),
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
