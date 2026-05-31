import { QueryClientProvider } from '@tanstack/react-query';
import { Link, useRouter } from '@tanstack/react-router';
import { Provider } from 'jotai';
import type { ReactNode } from 'react';

import { AuthProvider } from '~/components/auth/auth-provider';
import { authClient } from '~/lib/auth-client';
import type { Context } from './router-context';

export function WrapComponent({ children, context }: { children: ReactNode; context: Context }) {
  const router = useRouter();

  return (
    <QueryClientProvider client={context.queryClient}>
      <Provider store={context.store}>
        <AuthProvider
          authClient={authClient}
          navigate={({ to }) => router.navigate({ to })}
          Link={({ href, ...props }) => <Link to={href} {...props} />}
        >
          {children}
        </AuthProvider>
      </Provider>
    </QueryClientProvider>
  );
}
