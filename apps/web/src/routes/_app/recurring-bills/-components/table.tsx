import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@personal-finance-app/ui/components/avatar';
import { Card } from '@personal-finance-app/ui/components/card';
import { formatCurrency } from '@personal-finance-app/ui/lib/formatters';
import { classNames } from '@personal-finance-app/ui/lib/utils';
import { rankItem } from '@tanstack/match-sorter-utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  type PaginationState,
  type ColumnSort,
} from '@tanstack/react-table';
import * as React from 'react';
import type { SortByValue } from '../../-components/sort-by';
import type { RouterOutputs } from '@personal-finance-app/api/server';
import { Route } from '..';
import Pagination from '../../-components/pagination';
import SortBy from '../../-components/sort-by';
import Search from './search-table';
import { recurrenceOptions } from './upsert-bill.form';
import { trpc } from '@/router';

type BillsTableData = RouterOutputs['bills']['all'][number];

const t = createColumnHelper<BillsTableData>();

function getColumnSort(sortBy: SortByValue): ColumnSort {
  switch (sortBy) {
    case 'latest':
      return {
        id: 'date',
        desc: true,
      };
    case 'oldest':
      return {
        id: 'date',
        desc: false,
      };
    case 'atoz':
      return {
        id: 'name',
        desc: false,
      };
    case 'ztoa':
      return {
        id: 'name',
        desc: true,
      };
    case 'highest':
      return {
        id: 'amount',
        desc: true,
      };
    case 'lowest':
      return {
        id: 'amount',
        desc: false,
      };
  }
}

const columns = [
  t.accessor('name', {
    header: 'Bill Title',
    cell: ({ row }) => {
      const { party, name } = row.original;
      return (
        <div className="flex items-center gap-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={party?.avatar ?? undefined}
              alt={party?.name ?? name}
            />
            <AvatarFallback>{(party?.name ?? name).slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-grey-900 text-preset-4 font-bold">{name}</p>
          </div>
        </div>
      );
    },
  }),
  t.accessor('daysBetween', {
    header: 'Due Date',
    cell: ({ row }) => {
      const { daysBetween, instancesCount, paidInstancesCount, isActive } =
        row.original;
      const isPaid = instancesCount - paidInstancesCount === 0;
      const recurrence =
        recurrenceOptions.find(
          (option) => option.value === daysBetween.toString(),
        )?.label ?? '-';

      return (
        <span
          className={classNames(
            'text-preset-5 text-grey-500 flex items-center gap-x-2',
            {
              'text-green': isActive && isPaid,
            },
          )}
        >
          {recurrence} -{formatOrdinal(instancesCount)}
          {isActive && isPaid && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1.5C6.71442 1.5 5.45772 1.88122 4.3888 2.59545C3.31988 3.30968 2.48676 4.32484 1.99479 5.51256C1.50282 6.70028 1.37409 8.00721 1.6249 9.26809C1.8757 10.529 2.49477 11.6872 3.40381 12.5962C4.31285 13.5052 5.47104 14.1243 6.73192 14.3751C7.99279 14.6259 9.29973 14.4972 10.4874 14.0052C11.6752 13.5132 12.6903 12.6801 13.4046 11.6112C14.1188 10.5423 14.5 9.28558 14.5 8C14.4982 6.27665 13.8128 4.62441 12.5942 3.40582C11.3756 2.18722 9.72335 1.50182 8 1.5ZM10.8538 6.85375L7.35375 10.3538C7.30732 10.4002 7.25217 10.4371 7.19147 10.4623C7.13077 10.4874 7.06571 10.5004 7 10.5004C6.9343 10.5004 6.86923 10.4874 6.80853 10.4623C6.74783 10.4371 6.69269 10.4002 6.64625 10.3538L5.14625 8.85375C5.05243 8.75993 4.99972 8.63268 4.99972 8.5C4.99972 8.36732 5.05243 8.24007 5.14625 8.14625C5.24007 8.05243 5.36732 7.99972 5.5 7.99972C5.63268 7.99972 5.75993 8.05243 5.85375 8.14625L7 9.29313L10.1463 6.14625C10.1927 6.09979 10.2479 6.06294 10.3086 6.0378C10.3693 6.01266 10.4343 5.99972 10.5 5.99972C10.5657 5.99972 10.6308 6.01266 10.6915 6.0378C10.7521 6.06294 10.8073 6.09979 10.8538 6.14625C10.9002 6.1927 10.9371 6.24786 10.9622 6.30855C10.9873 6.36925 11.0003 6.4343 11.0003 6.5C11.0003 6.5657 10.9873 6.63075 10.9622 6.69145C10.9371 6.75214 10.9002 6.8073 10.8538 6.85375Z"
                fill="#277C78"
              />
            </svg>
          )}
          {!isPaid && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1.5C6.71442 1.5 5.45772 1.88122 4.3888 2.59545C3.31988 3.30968 2.48676 4.32484 1.99479 5.51256C1.50282 6.70028 1.37409 8.00721 1.6249 9.26809C1.8757 10.529 2.49477 11.6872 3.40381 12.5962C4.31285 13.5052 5.47104 14.1243 6.73192 14.3751C7.99279 14.6259 9.29973 14.4972 10.4874 14.0052C11.6752 13.5132 12.6903 12.6801 13.4046 11.6112C14.1188 10.5423 14.5 9.28558 14.5 8C14.4982 6.27665 13.8128 4.62441 12.5942 3.40582C11.3756 2.18722 9.72335 1.50182 8 1.5ZM7.5 5C7.5 4.86739 7.55268 4.74021 7.64645 4.64645C7.74022 4.55268 7.86739 4.5 8 4.5C8.13261 4.5 8.25979 4.55268 8.35356 4.64645C8.44732 4.74021 8.5 4.86739 8.5 5V8.5C8.5 8.63261 8.44732 8.75979 8.35356 8.85355C8.25979 8.94732 8.13261 9 8 9C7.86739 9 7.74022 8.94732 7.64645 8.85355C7.55268 8.75979 7.5 8.63261 7.5 8.5V5ZM8 11.5C7.85167 11.5 7.70666 11.456 7.58333 11.3736C7.45999 11.2912 7.36386 11.1741 7.30709 11.037C7.25033 10.9 7.23548 10.7492 7.26441 10.6037C7.29335 10.4582 7.36478 10.3246 7.46967 10.2197C7.57456 10.1148 7.7082 10.0434 7.85368 10.0144C7.99917 9.98547 8.14997 10.0003 8.28701 10.0571C8.42406 10.1139 8.54119 10.21 8.6236 10.3333C8.70602 10.4567 8.75 10.6017 8.75 10.75C8.75 10.9489 8.67098 11.1397 8.53033 11.2803C8.38968 11.421 8.19892 11.5 8 11.5Z"
                fill="#C94736"
              />
            </svg>
          )}
        </span>
      );
    },
  }),
  t.accessor('amount', {
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const { amount, instancesCount, paidInstancesCount } = row.original;
      const isPaid = instancesCount - paidInstancesCount === 0;
      return (
        <span
          className={classNames(
            'text-right inline-block w-full text-grey-900 text-preset-4 font-bold',
            {
              'text-red': !isPaid,
            },
          )}
        >
          {formatCurrency(amount)}{' '}
        </span>
      );
    },
  }),
  t.accessor('date', {}),
];

const fuzzyFilter: FilterFn<BillsTableData> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta(itemRank);
  return itemRank.passed;
};

export default function BillsTable() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { data } = useSuspenseQuery(trpc.bills.all.queryOptions());
  const sorting = React.useMemo(
    () => [getColumnSort(search.sortBy)],
    [search.sortBy],
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: (updaterOrValue) => {
      let data: PaginationState;
      if (typeof updaterOrValue === 'function') {
        data = updaterOrValue({
          pageIndex: search.page - 1,
          pageSize: search.pageSize,
        });
      } else {
        data = updaterOrValue;
      }
      navigate({
        to: '.',
        search: (prev) => ({
          ...prev,
          page: data.pageIndex + 1,
          pageSize: data.pageSize,
        }),
      });
    },
    globalFilterFn: fuzzyFilter,
    state: {
      globalFilter: search.search,
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.pageSize,
      },
      sorting,
      columnVisibility: {
        date: false,
      },
    },
  });
  return (
    <Card>
      <div className="flex items-center justify-between gap-x-6 pb-6">
        <Search />
        <div className="flex items-center gap-x-6">
          <SortBy sortBy={search.sortBy} />
        </div>
      </div>

      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className="md:text-preset-5 md:text-grey-500 md:border-grey-100 hidden md:table-cell md:border-b md:px-4 md:py-3 md:text-left md:font-normal"
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              className="border-grey-100 border-b last:border-none"
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  <div className="flex items-center gap-x-4 py-4 xl:px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pt-6">
        <Pagination
          currentPage={search.page}
          totalPages={table.getPageCount()}
          onClick={(page) => {
            table.setPageIndex(page - 1);
          }}
        />
      </div>
    </Card>
  );
}

function formatOrdinal(number: number) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const remainder10 = number % 10;
  const remainder100 = number % 100;

  const suffix =
    remainder100 >= 11 && remainder100 <= 13
      ? suffixes[0]
      : suffixes[remainder10] || suffixes[0];

  return number.toString() + suffix;
}
