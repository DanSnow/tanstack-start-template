import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '~/drizzle/db'
import * as schema from '~/drizzle/schema'
import { reactStartCookies } from 'better-auth/react-start'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite', // or "pg" or "mysql"
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [reactStartCookies()],
})
