import type { AuthInstance } from '@personal-finance-app/auth/server';
import type { DatabaseInstance } from '@personal-finance-app/db/client';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import billRouter from './router/bill.router';
import budgetRouter from './router/budget.router';
import partyRouter from './router/party.router';
import potRouter from './router/pot.router';
import themeRouter from './router/theme.router';
import transactionRouter from './router/transaction.router';
import { createTRPCContext as createTRPCContextInternal, router } from './trpc';

export const appRouter = router({
  budgets: budgetRouter,
  themes: themeRouter,
  pots: potRouter,
  transactions: transactionRouter,
  parties: partyRouter,
  bills: billRouter,
});

export const createApi = ({
  auth,
  db,
  allowedAPIKeys,
}: {
  auth: AuthInstance;
  db: DatabaseInstance;
  allowedAPIKeys: string[];
}) => {
  return {
    trpcRouter: appRouter,
    createTRPCContext: ({ headers }: { headers: Headers }) =>
      createTRPCContextInternal({ auth, db, headers, allowedAPIKeys }),
  };
};

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
