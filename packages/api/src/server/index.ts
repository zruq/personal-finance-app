import type { AuthInstance } from '@personal-finance-app/auth/server';
import type { DatabaseInstance } from '@personal-finance-app/db/client';
import budgetRouter from './router/budget.router';
import { createTRPCContext as createTRPCContextInternal, router } from './trpc';

export const appRouter = router({
  budgets: budgetRouter,
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
