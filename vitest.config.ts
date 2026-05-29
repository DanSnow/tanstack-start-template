import process from 'node:process';

import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

Object.assign(process.env, loadEnv('test', process.cwd(), ''));

export default defineConfig({
  test: {
    environment: 'happy-dom',
  },
});
