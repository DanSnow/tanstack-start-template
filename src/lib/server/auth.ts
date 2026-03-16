import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { genericOAuth } from 'better-auth/plugins';
import { db } from '~/drizzle/db';
import * as schema from '~/drizzle/schema';
import { env } from '~/env';

const oidcConfigured = !!(env.OIDC_CLIENT_ID && env.OIDC_CLIENT_SECRET);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
  }),
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    tanstackStartCookies(),
    ...(oidcConfigured
      ? [
          genericOAuth({
            config: [
              {
                providerId: 'oidc',
                clientId: env.OIDC_CLIENT_ID!,
                clientSecret: env.OIDC_CLIENT_SECRET!,
                ...(env.OIDC_PROVIDER_URL
                  ? { discoveryUrl: `${env.OIDC_PROVIDER_URL}/.well-known/openid-configuration` }
                  : {
                      authorizationUrl: env.OIDC_AUTHORIZATION_URL!,
                      tokenUrl: env.OIDC_TOKEN_URL!,
                    }),
              },
            ],
          }),
        ]
      : []),
  ],
});
