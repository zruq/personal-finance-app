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
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { z } from 'zod';
import { PageHeader } from '../-components/page-header';
import SortBy from '../-components/sort-by';
import CreateTransaction from './-components/create-transaction';
import FilterCategories from './-components/filter-categories';
import Pagination from './-components/pagination';
import Search from './-components/search';
import { queryClient } from '@/clients/queryClient';
import { trpc } from '@/router';

export const sortByValues = [
  'latest',
  'oldest',
  'atoz',
  'ztoa',
  'highest',
  'lowest',
] as const;

const transactionsSearchSchema = z.object({
  page: z.number({ coerce: true }).int().min(1).catch(1),
  sortBy: z.enum(sortByValues).catch('latest'),
  category: z.string().optional().catch(undefined),
  search: z.string().optional().catch(undefined),
});

const HEADERS = [
  {
    id: 1,
    label: 'Recipient / Sender',
  },
  {
    id: 2,
    label: 'Category',
  },
  {
    id: 3,
    label: 'Transaction Date',
  },
  {
    id: 4,
    label: 'Amount',
    className: 'md:text-right',
  },
];

export const Route = createFileRoute('/_app/transactions')({
  component: TransactionsPage,
  validateSearch: transactionsSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    queryClient.ensureQueryData(trpc.transactions.many.queryOptions(deps)),
});

function TransactionsPage() {
  const [showCreateTransaction, setShowCreateTransaction] =
    React.useState(false);
  const searchParams = Route.useSearch();
  const {
    data: { meta, transactions },
  } = useSuspenseQuery(trpc.transactions.many.queryOptions(searchParams));
  return (
    <div>
      <PageHeader
        title="Transactions"
        action={{
          text: '+ Add New Transaction',
          onClick: () => {
            setShowCreateTransaction(true);
          },
        }}
      />
      <div className="pt-8">
        <Card>
          <div className="flex items-center justify-between gap-x-6 pb-6">
            <Search />
            <div className="flex items-center gap-x-6">
              <SortBy sortBy={searchParams.sortBy} />
              <FilterCategories />
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                {HEADERS.map((header) => (
                  <th
                    key={header.id}
                    className={classNames(
                      'md:text-preset-5 md:text-grey-500 md:border-grey-100 hidden md:table-cell md:border-b md:px-4 md:py-3 md:text-left md:font-normal',
                      header.className,
                    )}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((row) => (
                <tr
                  key={row.id}
                  className="border-grey-100 border-b last:border-none"
                >
                  <td className="flex items-center gap-x-4 py-4 xl:px-4">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                      <AvatarImage
                        src={row.party?.avatar ?? undefined}
                        alt={row.party?.name ?? 'Unknown'}
                      />
                      <AvatarFallback>
                        {row.party?.name?.slice(0, 2) ?? 'Un'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-preset-4 font-bold">
                        {row.party?.name ?? 'Unknown'}
                      </p>
                      <p className="text-preset-5 text-grey-500 capitalize md:hidden">
                        {row.category}
                      </p>
                    </div>
                  </td>
                  <td className="text-preset-5 text-grey-500 hidden py-4 capitalize md:table-cell xl:px-4">
                    {row.category}
                  </td>
                  <td className="text-preset-5 text-grey-500 hidden py-4 md:table-cell xl:px-4">
                    {new Date(row.date).toLocaleDateString(
                      'en-GB',
                      dateFormatOptions,
                    )}
                  </td>
                  <td className="py-4 xl:px-4">
                    <p
                      className={classNames(
                        'text-preset-4 text-right font-bold',
                        {
                          'text-green': row.amount > 0,
                        },
                      )}
                    >
                      {row.amount > 0 && '+'}
                      {formatCurrency(row.amount)}
                    </p>

                    <p className="text-preset-5 text-grey-500 text-right capitalize md:hidden">
                      {new Date(row.date).toLocaleDateString(
                        'en-GB',
                        dateFormatOptions,
                      )}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pt-6">
            <Pagination {...meta} />
          </div>
        </Card>
      </div>

      <CreateTransaction
        open={showCreateTransaction}
        onOpenChange={setShowCreateTransaction}
      />
    </div>
  );
}
