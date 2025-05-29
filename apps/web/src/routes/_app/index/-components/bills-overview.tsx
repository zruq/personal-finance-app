import { Card } from '@personal-finance-app/ui/components/card';
import { formatCurrency } from '@personal-finance-app/ui/lib/formatters';
import { Link } from '@tanstack/react-router';
import type { RouterOutputs } from '@personal-finance-app/api/server';
import RightArrowFilled from '../../-icons/right-arrow-filled.icon';

type RecurringBillsOverviewProps = RouterOutputs['bills']['summary'] & {
  className?: string;
};

export default function RecurringBillsOverview({
  duesoon,
  paid,
  unpaid,
  className,
}: RecurringBillsOverviewProps) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between pb-8">
        <h2 className="text-preset-2">Recurring Bills</h2>
        <Link
          className="text-grey-500 fill-grey-500 hover:text-grey-900 hover:fill-grey-900 text-preset-4 flex items-center gap-x-3 transition duration-300"
          to={'/recurring-bills'}
        >
          <span>View All</span>

          <RightArrowFilled className="h-3 w-3" />
        </Link>
      </div>

      <ul className="space-y-3">
        <li className="bg-beige-100 flex justify-between items-center px-4 py-5 rounded-xl border-l-4 border-green">
          <p className="text-grey-500 text-preset-4">Paid Bills</p>
          <p className="text-preset-4 font-bold text-grey-900">
            {formatCurrency(paid.sum)}
          </p>
        </li>
        <li className="bg-beige-100 flex justify-between items-center px-4 py-5 rounded-xl border-l-4 border-yellow">
          <p className="text-grey-500 text-preset-4">Total Upcoming</p>
          <p className="text-preset-4 font-bold text-grey-900">
            {formatCurrency(unpaid.sum)}
          </p>
        </li>
        <li className="bg-beige-100 flex justify-between items-center px-4 py-5 rounded-xl border-l-4 border-cyan">
          <p className="text-grey-500 text-preset-4">Due Soon</p>
          <p className="text-preset-4 font-bold text-grey-900">
            {formatCurrency(duesoon.sum)}
          </p>
        </li>
      </ul>
    </Card>
  );
}
