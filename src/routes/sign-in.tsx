import { createFileRoute } from '@tanstack/react-router';

import { Auth } from '~/components/auth/auth';

export const Route = createFileRoute('/sign-in')({
  component: RouteComponent,
  loader: async ({ context: { orpc, queryClient } }) => {
    const oidcConfigured = await queryClient.ensureQueryData(orpc.auth.oidcConfigured.queryOptions());
    return { oidcConfigured };
  },
});

function RouteComponent() {
  const { oidcConfigured } = Route.useLoaderData();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Auth view="signIn" oidcConfigured={oidcConfigured} />
    </div>
  );
}
