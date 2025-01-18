import { z } from 'zod'
import { publicProcedure, router } from './trpc'

export const appRouter = router({
  greet: publicProcedure.input(z.object({ name: z.string() })).query(({ input }) => `Hello ${input.name}!`),
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
