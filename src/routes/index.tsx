import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { useCallback } from 'react';
import { Button } from '~/components/ui/button';
import { getServerSession } from '~/utils/server-session';

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context: { orpc, queryClient } }) => {
    const greeting = await queryClient.ensureQueryData(
      orpc.greet.queryOptions({
        input: {
          name: 'World',
        },
      }),
    );
    const session = await getServerSession();
    return { greeting, session };
  },
});

const hello = createServerFn({
  method: 'POST',
}).handler(() => {
  return 'Hello World!';
});

function Home() {
  const { greeting, session } = Route.useLoaderData();
  const handleClick = useCallback(async () => {
    const res = await hello();
    console.log(res);
  }, []);
  return (
    <div className="p-2">
      <h3>{greeting}</h3>
      <p>{session ? `Hi ${session.user.name}` : 'Not Login'}</p>
      <Button onClick={handleClick}>Click Me!</Button>
    </div>
  );
}
