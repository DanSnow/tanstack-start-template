import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'
import process from 'node:process'

export const env = createEnv({
  server: {
    DB_FILE_NAME: z.string(),
    HASH_ID_SECRET: z.string(),
  },
  runtimeEnvStrict: {
    DB_FILE_NAME: process.env.DB_FILE_NAME,
    HASH_ID_SECRET: process.env.HASH_ID_SECRET,
  },
})
