import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import { env } from './env'

export default defineConfig({
  out: './drizzle',
  schema: './drizzle/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DB_FILE_NAME,
  },
})
