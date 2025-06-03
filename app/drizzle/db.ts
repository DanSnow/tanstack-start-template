import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import { env } from '~/env'
import * as schema from './schema'

export const db = drizzle<typeof schema>(env.DB_FILE_NAME, {
  schema,
})
