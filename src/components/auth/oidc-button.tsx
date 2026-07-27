'use client';

import { authMutationKeys } from '@better-auth-ui/core';
import { useAuth, useSignInSocial } from '@better-auth-ui/react';
import { useIsMutating } from '@tanstack/react-query';

import { Button } from '~/components/ui/button';
import { Spinner } from '~/components/ui/spinner';

export type OidcButtonProps = {
  className?: string;
};

/**
 * Sign-in button for the server-configured OIDC provider.
 *
 * better-auth's generic-oauth plugin registers the "oidc" provider through the
 * standard `signIn.social` endpoint rather than a plugin-specific one.
 */
export function OidcButton({ className }: OidcButtonProps) {
  const { authClient, baseURL, redirectTo } = useAuth();

  const callbackURL = `${baseURL}${redirectTo}`;

  const { mutate: signInSocial, isPending: signInSocialPending } = useSignInSocial(authClient);

  const signInMutating = useIsMutating({
    mutationKey: authMutationKeys.signIn.all,
  });
  const signUpMutating = useIsMutating({
    mutationKey: authMutationKeys.signUp.all,
  });
  const isPending = signInMutating + signUpMutating > 0;

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      onClick={() => signInSocial({ provider: 'oidc', callbackURL })}
      className={className}
    >
      {signInSocialPending && <Spinner />}
      Continue with OIDC
    </Button>
  );
}
