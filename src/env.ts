import process from 'node:process';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
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
  runtimeEnvStrict: {
    DB_FILE_NAME: process.env.DB_FILE_NAME,
    HASH_ID_SECRET: process.env.HASH_ID_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    OIDC_PROVIDER_URL: process.env.OIDC_PROVIDER_URL,
    OIDC_AUTHORIZATION_URL: process.env.OIDC_AUTHORIZATION_URL,
    OIDC_TOKEN_URL: process.env.OIDC_TOKEN_URL,
    OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID,
    OIDC_CLIENT_SECRET: process.env.OIDC_CLIENT_SECRET,
  },
});
