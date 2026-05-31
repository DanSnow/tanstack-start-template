import { createFileRoute } from '@tanstack/react-router';

import { Auth } from '~/components/auth/auth';

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Auth view="signUp" />
    </div>
  );
}
