import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '@personal-finance-app/ui/components/select';
import { useWindowSize } from '@personal-finance-app/ui/hooks/use-window-size';
import FilterIcon from '@personal-finance-app/ui/icons/filter.icon';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { QueryResult } from '../../-components/query-result';
import { Route } from '../route';
import { trpc } from '@/router';

export default function FilterCategories() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { category } = Route.useSearch();
  const categoriesQuery = useQuery(trpc.transactions.categories.queryOptions());
  const allTransactionsId = 'all';
  const { width } = useWindowSize();

  return (
    <div className="flex items-center gap-x-2">
      <label
        htmlFor="categoryFilter"
        className="text-grey-500 text-preset-4 sr-only whitespace-nowrap md:not-sr-only"
      >
        Category
      </label>

      <Select
        value={category ?? allTransactionsId}
        onValueChange={(value) => {
          navigate({
            search: (prev) => ({
              ...prev,
              category: value !== allTransactionsId ? value : undefined,
            }),
          });
        }}
      >
        <SelectTrigger
          id="categoryFilter"
          className="border-0 p-0 md:w-[177px] md:border md:px-5 md:py-3 [&>svg]:last:hidden md:[&>svg]:last:block"
        >
          {width < 768 ? (
            <FilterIcon className="fill-grey-900 hover:fill-grey-500 size-4" />
          ) : (
            <SelectValue />
          )}
        </SelectTrigger>

        <SelectContent className="w-[177px]">
          <QueryResult {...categoriesQuery}>
            {(categories) => (
              <SelectGroup>
                <SelectItem
                  className="py-3 first:pt-0 last:pb-0"
                  value={allTransactionsId}
                >
                  All Transactions
                </SelectItem>
                <SelectSeparator className="last:hidden" />

                {categories.map((category) => (
                  <React.Fragment key={category.name}>
                    <SelectItem
                      className="py-3 first:pt-0 last:pb-0"
                      value={category.name}
                    >
                      <span className="capitalize">{category.name}</span>
                    </SelectItem>
                    <SelectSeparator className="last:hidden" />
                  </React.Fragment>
                ))}
              </SelectGroup>
            )}
          </QueryResult>
        </SelectContent>
      </Select>
    </div>
  );
}
