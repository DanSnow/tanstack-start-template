import 'dotenv/config';
import { defineRelations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';

import { env } from '~/env';

import * as schema from './schema';

const relations = defineRelations(schema);

export const db = drizzle(env.DB_FILE_NAME, {
  relations,
});
