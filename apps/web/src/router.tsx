import { Spinner } from '@personal-finance-app/ui/components/spinner';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRouter as createTanstackRouter } from '@tanstack/react-router';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import type { AppRouter } from '@personal-finance-app/api/server';
import { routeTree } from './routeTree.gen';
import { queryClient } from '@/clients/queryClient';
import { trpcClient } from '@/clients/trpcClient';
import { env } from '@/env';

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

export function createRouter() {
  const router = createTanstackRouter({
    routeTree,
    basepath: env.PUBLIC_BASE_PATH,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPendingComponent: () => <Spinner />,
    Wrap({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    },
  });
  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
