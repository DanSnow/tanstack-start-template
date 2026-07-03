import process from 'node:process';

import { createEnv } from '@t3-oss/env-core';
import { joinURL } from 'ufo';
import { z } from 'zod';

export const env = createEnv({
  shared: {
    baseUrl: z.string().default('/'),
  },
  server: {
    DB_FILE_NAME: z.string(),
    HASH_ID_SECRET: z.string(),
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),
    OIDC_PROVIDER_URL: z.url().optional(),
    OIDC_AUTHORIZATION_URL: z.url().optional(),
    OIDC_TOKEN_URL: z.url().optional(),
    OIDC_CLIENT_ID: z.string().optional(),
    OIDC_CLIENT_SECRET: z.string().optional(),
  },
  client: {},
  clientPrefix: 'VITE_',
  runtimeEnvStrict: {
    baseUrl: import.meta.env.BASE_URL,
    DB_FILE_NAME: import.meta.env.SSR ? process.env.DB_FILE_NAME : undefined,
    HASH_ID_SECRET: import.meta.env.SSR ? process.env.HASH_ID_SECRET : undefined,
    BETTER_AUTH_URL: import.meta.env.SSR ? process.env.BETTER_AUTH_URL : undefined,
    BETTER_AUTH_SECRET: import.meta.env.SSR ? process.env.BETTER_AUTH_SECRET : undefined,
    OIDC_PROVIDER_URL: import.meta.env.SSR ? process.env.OIDC_PROVIDER_URL : undefined,
    OIDC_AUTHORIZATION_URL: import.meta.env.SSR ? process.env.OIDC_AUTHORIZATION_URL : undefined,
    OIDC_TOKEN_URL: import.meta.env.SSR ? process.env.OIDC_TOKEN_URL : undefined,
    OIDC_CLIENT_ID: import.meta.env.SSR ? process.env.OIDC_CLIENT_ID : undefined,
    OIDC_CLIENT_SECRET: import.meta.env.SSR ? process.env.OIDC_CLIENT_SECRET : undefined,
  },
});

export function appUrl(...paths: string[]) {
  return joinURL(env.baseUrl, ...paths);
}
