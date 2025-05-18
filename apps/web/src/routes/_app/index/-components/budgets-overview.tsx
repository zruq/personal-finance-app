import { Card } from '@personal-finance-app/ui/components/card';
import { formatCurrency } from '@personal-finance-app/ui/lib/formatters';
import { Link } from '@tanstack/react-router';
import type { RouterOutputs } from '@personal-finance-app/api/server';
import { DonutChart } from '../../-components/donut-chart';
import RightArrowFilled from '../../-icons/right-arrow-filled.icon';

type BudgetsOverviewProps = { budgets: RouterOutputs['budgets']['all'] };

export default function BudgetsOverview({ budgets }: BudgetsOverviewProps) {
  const totalSpent = budgets.reduce((acc, budget) => acc + budget.spent, 0);
  const maximumSpend = budgets.reduce(
    (acc, budget) => acc + budget.maximumSpend,
    0,
  );
  return (
    <Card>
      <div className="flex items-center justify-between pb-5">
        <h2 className="text-preset-2">Budgets</h2>
        <Link
          className="text-grey-500 fill-grey-500 hover:text-grey-900 hover:fill-grey-900 text-preset-4 flex items-center gap-x-3 transition duration-300"
          to={'/budgets'}
        >
          <span>See Details</span>

          <RightArrowFilled className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex items-center justify-center px-8 py-5">
        <DonutChart
          data={budgets.map((budget) => ({
            name: budget.name,
            value: budget.spent,
            color: budget.theme.color,
          }))}
          width={240}
          height={240}
          hole={
            <>
              <p className="text-preset-1 pb-2">
                {formatCurrency(totalSpent, false)}
              </p>
              <p className="text-preset-5 text-grey-500">
                of {formatCurrency(maximumSpend, false)} limit
              </p>
            </>
          }
        />
      </div>

      <ul className="grid grid-cols-2 gap-4 pt-5 md:pt-0">
        {budgets.map((budget) => (
          <li key={budget.id} className="flex items-center gap-x-4">
            <div
              style={{ backgroundColor: budget.theme.color }}
              className="h-11 w-1 rounded-full"
            ></div>

            <div className="flex flex-col items-start gap-y-1">
              <span className="text-preset-5 text-grey-500">{budget.name}</span>
              <div className="text-preset-4 font-bold">
                {formatCurrency(budget.spent)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
