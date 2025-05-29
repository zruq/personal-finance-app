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
import RecurringBillsOverview from './-components/bills-overview';

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
  loader: () =>
    Promise.all([
      queryClient.prefetchQuery(trpc.pots.all.queryOptions()),
      queryClient.prefetchQuery(trpc.budgets.all.queryOptions()),
      queryClient.prefetchQuery(trpc.transactions.many.queryOptions({})),
      queryClient.prefetchQuery(trpc.transactions.balance.queryOptions()),
      queryClient.prefetchQuery(trpc.bills.summary.queryOptions()),
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
  const { data: billsOverview } = useSuspenseQuery(
    trpc.bills.summary.queryOptions(),
  );
  return (
    <div>
      <PageHeader title="Overview" />
      <div className="space-y-3 py-8 md:flex md:gap-x-6 md:space-y-0">
        <Card className="bg-black md:p-6 md:space-y-3">
          <p className="text-preset-4 text-white">Current Balance</p>
          <p className="text-preset-1 text-white">{formatCurrency(balance)}</p>
        </Card>
        <Card className="md:p-6 md:space-y-3">
          <p className="text-preset-4 text-grey-500">Income</p>
          <p className="text-preset-1">{formatCurrency(income)}</p>
        </Card>
        <Card className="md:p-6 md:space-y-3">
          <p className="text-preset-4 text-grey-500">Expenses</p>
          <p className="text-preset-1">{formatCurrency(expenses)}</p>
        </Card>
      </div>
      <div className="min-[1440px]:flex md:gap-x-6 space-y-4 md:space-y-6 min-[1440px]:space-y-0">
        <div className="space-y-4 md:space-y-6 min-[1440px]:w-[59%]">
          <PotsOverview pots={pots} />
          <TransactionsOverview transactions={transactions.slice(0, 5)} />
        </div>
        <div className="min-lg:max-[1440px]:grid min-lg:max-[1440px]:grid-cols-2 min-lg:max-[1440px]:items-stretch min-lg:max-[1440px]:gap-x-6 space-y-4 md:space-y-6 min-[1440px]:w-[41%]">
          <BudgetsOverview
            budgets={budgets}
            className="min-lg:max-[1440px]:h-full"
          />
          <RecurringBillsOverview
            {...billsOverview}
            className="min-lg:max-[1440px]:h-full"
          />
        </div>
      </div>
    </div>
  );
}
