import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { PageHeader } from '../-components/page-header';
import BudgetCard from './-components/budget-card';
import CreateBudget from './-components/create-budget';
import SpendingSummary from './-components/spending-summary';
import { queryClient } from '@/clients/queryClient';
import { trpc } from '@/router';

export const Route = createFileRoute('/_app/budgets')({
  component: RouteComponent,
  loader: () => queryClient.ensureQueryData(trpc.budgets.all.queryOptions()),
});

function RouteComponent() {
  const [showCreateBudget, setShowCreateBudget] = React.useState(false);
  const { data: budgets } = useSuspenseQuery(trpc.budgets.all.queryOptions());
  const usedThemesIds = budgets.map((budget) => budget.theme.id);
  return (
    <div>
      <PageHeader
        title="Budgets"
        action={{
          text: '+ Add New Budget',
          onClick: () => {
            setShowCreateBudget(true);
          },
        }}
      />
      <div className="pt-8 xl:flex xl:gap-x-6">
        <div className="xl:w-[428px]">
          <div className="pb-6 xl:sticky xl:top-10">
            <SpendingSummary budgets={budgets} />
          </div>
        </div>

        <ul className="space-y-6 xl:flex-1">
          {budgets.map((budget) => (
            <li key={budget.id}>
              <BudgetCard
                usedThemesIds={usedThemesIds.filter((id) => id !== budget.id)}
                {...budget}
              />
            </li>
          ))}
        </ul>
      </div>

      <CreateBudget
        usedThemesIds={usedThemesIds}
        open={showCreateBudget}
        onOpenChange={setShowCreateBudget}
      />
    </div>
  );
}
