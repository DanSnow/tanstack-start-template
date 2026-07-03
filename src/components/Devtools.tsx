import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { useRouteContext } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { useEffect, useState } from 'react';

import { JotaiDevtoolsPanel } from './JotaiDevtoolPanel';

function Devtools() {
  const { queryClient, store } = useRouteContext({ from: '__root__' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <>
        <TanStackDevtools
          plugins={[
            {
              name: 'TanStack Query',
              render: <ReactQueryDevtoolsPanel client={queryClient} />,
            },
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: 'Jotai',
              render: <JotaiDevtoolsPanel store={store} theme="dark" />,
            },
          ]}
        />
      </>
    )
  );
}

Devtools.displayName = 'Devtools';

// biome-ignore lint/style/noDefaultExport: lazy component
export default Devtools;
