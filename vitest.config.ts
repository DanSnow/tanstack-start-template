import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import process from 'node:process';

Object.assign(process.env, loadEnv('test', process.cwd(), ''));

export default defineConfig({
  test: {
    environment: 'happy-dom',
  },
});
