import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from './src/env';

export default defineConfig({
  out: './src/drizzle/migrations',
  schema: './src/drizzle/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DB_FILE_NAME,
  },
});
