import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import { $, fs, path } from 'zx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

it('should generate auth schema', { timeout: 60_000 }, async () => {
  await fs.rm(path.resolve(__dirname, '../src/drizzle/auth-schema.ts'), {
    force: true,
  });

  await $({ input: 'y' })`pnpm exec moon run generate-auth`;

  const isExist = await fs.exists(path.resolve(__dirname, '../src/drizzle/auth-schema.ts'));
  expect(isExist).toBe(true);
});
