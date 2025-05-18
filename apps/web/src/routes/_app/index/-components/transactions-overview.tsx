import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@personal-finance-app/ui/components/avatar';
import { Card } from '@personal-finance-app/ui/components/card';
import {
  dateFormatOptions,
  formatCurrency,
} from '@personal-finance-app/ui/lib/formatters';
import { classNames } from '@personal-finance-app/ui/lib/utils';
import { Link } from '@tanstack/react-router';
import type { RouterOutputs } from '@personal-finance-app/api/server';
import RightArrowFilled from '../../-icons/right-arrow-filled.icon';

type TransactionsOverviewProps = {
  transactions: RouterOutputs['transactions']['many']['transactions'];
};

export default function TransactionsOverview({
  transactions,
}: TransactionsOverviewProps) {
  return (
    <Card>
      <div className="flex items-center justify-between pb-5">
        <h2 className="text-preset-2">Transactions</h2>
        <Link
          className="text-grey-500 fill-grey-500 hover:text-grey-900 hover:fill-grey-900 text-preset-4 flex items-center gap-x-3 transition duration-300"
          to={'/transactions'}
        >
          <span>View All</span>

          <RightArrowFilled className="h-3 w-3" />
        </Link>
      </div>

      <ul>
        {transactions.map((transaction, index) => (
          <li key={transaction.id}>
            <div
              className={classNames('flex items-center justify-between py-3', {
                'pt-0': index === 0,
                'pb-0': index === transactions.length - 1,
              })}
            >
              <div className="flex items-center gap-x-4">
                <Avatar className="hidden md:flex">
                  <AvatarImage
                    src={transaction.party?.avatar ?? undefined}
                    alt={transaction.party?.name ?? 'Unknown'}
                  />
                  <AvatarFallback>
                    {transaction.party?.name.slice(0, 2) ?? 'Un'}
                  </AvatarFallback>
                </Avatar>
                <p className="text-preset-4 font-bold">
                  {transaction.party?.name ?? 'Unknown'}
                </p>
              </div>

              <div>
                <p
                  className={classNames('text-preset-4 text-right font-bold', {
                    'text-green': transaction.amount > 0,
                  })}
                >
                  {transaction.amount > 0 && '+'}
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-preset-5 text-grey-500 text-right">
                  {new Date(transaction.date).toLocaleDateString(
                    'en-GB',
                    dateFormatOptions,
                  )}
                </p>
              </div>
            </div>
            {index !== transactions.length - 1 && (
              <div className="bg-grey-500 h-px opacity-15"></div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
