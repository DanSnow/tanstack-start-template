import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { db } from '~/drizzle/db';
import * as schema from '~/drizzle/schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite', // or "pg" or "mysql"
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
});
