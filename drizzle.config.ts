import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import { env } from './app/env'

export default defineConfig({
  out: './app/drizzle',
  schema: './app/drizzle/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DB_FILE_NAME,
  },
})
