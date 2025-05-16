import { Card } from '@personal-finance-app/ui/components/card';
import { formatCurrency } from '@personal-finance-app/ui/lib/formatters';
import { classNames } from '@personal-finance-app/ui/lib/utils';
import type { RouterOutputs } from '@personal-finance-app/api/server';
import { DonutChart } from '../../-components/donut-chart';

type SpendingSummaryProps = {
  budgets: RouterOutputs['budgets']['all'];
};
export default function SpendingSummary({ budgets }: SpendingSummaryProps) {
  const totalSpent = budgets.reduce((acc, c) => acc + c.spent, 0);
  const limit = budgets.reduce((acc, c) => acc + c.maximumSpend, 0);
  const noSpendingsYet = budgets.every((budget) => budget.spent === 0);
  return (
    <Card className="md:flex md:items-center md:gap-x-8 xl:block">
      <div className="flex items-center justify-center px-8 py-5">
        <DonutChart
          data={
            noSpendingsYet
              ? [{ name: '', value: 1, color: '#F2F2F2' }]
              : budgets.map((budget) => ({
                  name: budget.name,
                  value: budget.spent,
                  color: budget.theme.color,
                }))
          }
          width={240}
          height={240}
          hole={
            <>
              <p className="text-preset-1 pb-2">{formatCurrency(totalSpent)}</p>
              <p className="text-preset-5 text-grey-500">
                of {formatCurrency(limit)} limit
              </p>
            </>
          }
        />
      </div>

      <div className="pt-8 md:flex-1 md:pt-0 md:pr-8 xl:pt-8 xl:pr-0">
        <h2 className="text-preset-2 pb-6">Spending Summary</h2>
        <ul className="space-y-4">
          {budgets.map((budget, index) => {
            return (
              <li key={budget.id}>
                <div
                  className={classNames(
                    'flex items-center justify-between pb-4',
                    { 'pb-0': index === budgets.length - 1 },
                  )}
                >
                  <div className="flex items-center gap-x-4">
                    <div
                      style={{ backgroundColor: budget.theme.color }}
                      className="h-5 w-1 rounded-full"
                    ></div>
                    <p className="text-preset-4 text-grey-500 capitalize">
                      {budget.name}
                    </p>
                  </div>
                  <p>
                    <span className="text-preset-3">
                      {formatCurrency(budget.spent)}
                    </span>{' '}
                    <span className="text-preset-5 text-grey-500">
                      of {formatCurrency(budget.maximumSpend)}
                    </span>
                  </p>
                </div>

                {index !== budgets.length - 1 && (
                  <div className="bg-grey-500 h-px opacity-15"></div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
