import { fileURLToPath, pathToFileURL } from 'node:url';
import { expect, it } from 'vitest';
import { $, fs, path } from 'zx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

it('should generate auth schema', { timeout: 60_000 }, async () => {
  await fs.rm(path.resolve(__dirname, '../src/drizzle/auth-schema.ts'), {
    force: true,
  });

  if (process.env.CI) {
    if (!process.env.DB_FILE_NAME) {
      process.env.DB_FILE_NAME = pathToFileURL(path.join(__dirname, 'test.sqlite')).toString();
    }
    if (!process.env.HASH_ID_SECRET) {
      process.env.HASH_ID_SECRET = 'secret';
    }
  }

  await $({ input: 'y' })`pnpm exec moon run 'tanstack-start-template:generate-auth'`;

  const isExist = await fs.exists(path.resolve(__dirname, '../src/drizzle/auth-schema.ts'));
  expect(isExist).toBe(true);
});
