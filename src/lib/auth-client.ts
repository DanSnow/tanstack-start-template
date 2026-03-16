import { createAuthClient } from 'better-auth/react';
import { genericOAuthClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [genericOAuthClient()],
});

export const { useSession, signIn, signUp, signOut } = authClient;
