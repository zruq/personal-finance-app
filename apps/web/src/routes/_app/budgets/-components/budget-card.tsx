import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@personal-finance-app/ui/components/avatar';
import { Card } from '@personal-finance-app/ui/components/card';
import { DropdownMenu } from '@personal-finance-app/ui/components/dropdown';
import {
  formatCurrency,
  dateFormatOptions,
} from '@personal-finance-app/ui/lib/formatters';
import { classNames } from '@personal-finance-app/ui/lib/utils';
import { Link } from '@tanstack/react-router';
import * as React from 'react';
import type { RouterOutputs } from '@personal-finance-app/api/server';
import EllipsisIcon from '../../-icons/ellipsis.icon';
import RightArrowFilled from '../../-icons/right-arrow-filled.icon';
import DeleteBudget from './delete-budget';
import EditBudget from './edit-budget';

type BudgetOverview = RouterOutputs['budgets']['all'][number];

type BudgetCardProps = BudgetOverview & { usedThemesIds: Array<number> };

export default function BudgetCard({
  id,
  theme,
  name,
  maximumSpend,
  spent,
  latestSpending,
  usedThemesIds,
}: BudgetCardProps) {
  const [showEditBudget, setShowEditBudget] = React.useState(false);
  const [showDeleteBudget, setShowDeleteBudget] = React.useState(false);
  const spentPercentage = Math.min((spent / maximumSpend) * 100, 100);
  return (
    <Card>
      <div className="flex items-center justify-between pb-5">
        <div className="flex items-center gap-x-4">
          <div
            style={{ backgroundColor: theme.color }}
            className="size-4 rounded-full"
          ></div>
          <h2 className="text-preset-2 capitalize">{name}</h2>
        </div>
        <DropdownMenu
          trigger={
            <button type="button" className="group cursor-pointer">
              <EllipsisIcon className="fill-grey-300 group-hover:fill-grey-500 size-4 transition-colors duration-300" />
              <span className="sr-only">settings</span>
            </button>
          }
          items={[
            {
              id: '1',
              label: 'Edit Budget',
              onClick: () => setShowEditBudget(true),
            },
            {
              id: '2',
              label: 'Delete Budget',
              onClick: () => setShowDeleteBudget(true),
              className: 'text-red',
            },
          ]}
        />
      </div>
      <p className="text-preset-4 text-grey-500 pb-4">
        Maximum of {formatCurrency(maximumSpend)}
      </p>
      <div className="rounded-sm bg-beige-100 h-8 p-1">
        <div
          className="rounded-sm h-6 w-16"
          style={{ width: `${spentPercentage}%`, backgroundColor: theme.color }}
        ></div>
      </div>
      <div className="grid grid-cols-2 pt-4 pb-5">
        <div className="flex gap-x-4">
          <div
            className="rounded-lg w-1"
            style={{ backgroundColor: theme.color }}
          ></div>
          <div>
            <p className="text-preset-5 text-grey-500 pb-1">Spent</p>
            <p className="text-preset-4 font-bold">{formatCurrency(spent)}</p>
          </div>
        </div>
        <div className="flex gap-x-4">
          <div className="rounded-lg bg-beige-100 w-1"></div>
          <div>
            <p className="text-preset-5 text-grey-500 pb-1">Remaining</p>
            <p className="text-preset-4 font-bold">
              {formatCurrency(Math.max(maximumSpend - spent, 0))}
            </p>
          </div>
        </div>
      </div>
      {latestSpending.length > 0 && (
        <div className="bg-beige-100 rounded-xl p-4">
          <div className="flex items-center justify-between pb-5">
            <p className="text-preset-3">Latest Spending</p>
            <Link
              className="text-grey-500 fill-grey-500 hover:text-grey-900 hover:fill-grey-900 text-preset-4 flex items-center gap-x-3 transition duration-300"
              to={'/transactions'}
            >
              <span>See All</span>

              <RightArrowFilled className="size-3" />
            </Link>
          </div>
          <ul>
            {latestSpending.map((transaction, index) => (
              <li key={transaction.id}>
                <div
                  className={classNames(
                    'flex items-center justify-between py-3',
                    {
                      'pt-0': index === 0,
                      'pb-0': index === latestSpending.length - 1,
                    },
                  )}
                >
                  <div className="flex items-center gap-x-4">
                    <Avatar className="hidden md:flex">
                      <AvatarImage
                        src={transaction.party?.avatar ?? undefined}
                        alt={transaction.party?.name ?? 'Unknown'}
                      />
                      <AvatarFallback>
                        {transaction.party?.name?.slice(0, 2) ?? 'Un'}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-preset-5 font-bold">
                      {transaction.party?.name ?? 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <p className="text-preset-5 text-right font-bold">
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
                {index !== latestSpending.length - 1 && (
                  <div className="bg-grey-500 h-px opacity-15"></div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <EditBudget
        usedThemesIds={usedThemesIds}
        open={showEditBudget}
        onOpenChange={setShowEditBudget}
        budget={{ id, maximumSpend, name, themeId: theme.id }}
      />
      <DeleteBudget
        open={showDeleteBudget}
        onOpenChange={setShowDeleteBudget}
        budget={{ name, id }}
      />
    </Card>
  );
}
