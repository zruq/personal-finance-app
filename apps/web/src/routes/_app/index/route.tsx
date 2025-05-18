import { Card } from '@personal-finance-app/ui/components/card';
import { formatCurrency } from '@personal-finance-app/ui/lib/formatters';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../-components/page-header';
import BudgetsOverview from './-components/budgets-overview';
import PotsOverview from './-components/pots-overview';
import TransactionsOverview from './-components/transactions-overview';
import { queryClient } from '@/clients/queryClient';
import { trpc } from '@/router';

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
  loader: () =>
    Promise.all([
      queryClient.prefetchQuery(trpc.pots.all.queryOptions()),
      queryClient.prefetchQuery(trpc.budgets.all.queryOptions()),
      queryClient.prefetchQuery(trpc.transactions.many.queryOptions({})),
      queryClient.prefetchQuery(trpc.transactions.balance.queryOptions()),
    ]),
});

function RouteComponent() {
  const {
    data: { balance, expenses, income },
  } = useSuspenseQuery(trpc.transactions.balance.queryOptions());
  const {
    data: { transactions },
  } = useSuspenseQuery(trpc.transactions.many.queryOptions({}));
  const { data: pots } = useSuspenseQuery(trpc.pots.all.queryOptions());
  const { data: budgets } = useSuspenseQuery(trpc.budgets.all.queryOptions());

  return (
    <div>
      <PageHeader title="Overview" />
      <div className="space-y-3 py-8 md:flex md:gap-x-6 md:space-y-0">
        <Card className="bg-black">
          <p className="text-preset-4 text-white">Current Balance</p>
          <p className="text-preset-1 text-white">{formatCurrency(balance)}</p>
        </Card>
        <Card>
          <p className="text-preset-4 text-grey-500">Income</p>
          <p className="text-preset-1">{formatCurrency(income)}</p>
        </Card>
        <Card>
          <p className="text-preset-4 text-grey-500">Expenses</p>
          <p className="text-preset-1">{formatCurrency(expenses)}</p>
        </Card>
      </div>
      <div className="space-y-4">
        <PotsOverview pots={pots} />
        <TransactionsOverview transactions={transactions.slice(5)} />
        <BudgetsOverview budgets={budgets} />
      </div>
    </div>
  );
}
