import type { AuthInstance } from '@personal-finance-app/auth/server';
import type { DatabaseInstance } from '@personal-finance-app/db/client';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import budgetRouter from './router/budget.router';
import themeRouter from './router/theme.router';
import { createTRPCContext as createTRPCContextInternal, router } from './trpc';

export const appRouter = router({
  budgets: budgetRouter,
  themes: themeRouter,
});

export const createApi = ({
  auth,
  db,
}: {
  auth: AuthInstance;
  db: DatabaseInstance;
}) => {
  return {
    trpcRouter: appRouter,
    createTRPCContext: ({ headers }: { headers: Headers }) =>
      createTRPCContextInternal({ auth, db, headers }),
  };
};

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
