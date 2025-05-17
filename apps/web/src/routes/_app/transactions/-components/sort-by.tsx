import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '@personal-finance-app/ui/components/select';
import { useNavigate } from '@tanstack/react-router';
import { Route, sortByValues } from '../route';
import { useWindowSize } from '@personal-finance-app/ui/hooks/use-window-size';
import SortIcon from '@personal-finance-app/ui/icons/sort.icon';

const SORT_BY_LABELS = {
  latest: 'Latest',
  oldest: 'Oldest',
  atoz: 'A to Z',
  ztoa: 'Z to A',
  highest: 'Highest',
  lowest: 'Lowest',
};

export default function SortBy() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { sortBy } = Route.useSearch();
  const { width } = useWindowSize();
  return (
    <div className="flex items-center gap-x-2">
      <label
        htmlFor="sortBy"
        className="text-grey-500 text-preset-4 sr-only whitespace-nowrap md:not-sr-only"
      >
        Sort By
      </label>

      <Select
        value={sortBy}
        onValueChange={(value) => {
          navigate({
            search: (prev) => ({ ...prev, sortBy: value }),
          });
        }}
      >
        <SelectTrigger
          id="sortByMobile"
          className="border-0 p-0 md:w-[114px] md:border md:px-5 md:py-3 [&>svg]:last:hidden md:[&>svg]:last:block"
        >
          {width < 768 ? (
            <SortIcon className="fill-grey-900 hover:fill-grey-500 size-4" />
          ) : (
            <SelectValue />
          )}
        </SelectTrigger>

        <SelectContent className="w-[114px]">
          <SelectGroup>
            {sortByValues.map((value) => (
              <React.Fragment key={value}>
                <SelectItem
                  className="selected:font-bold py-3 first:pt-0 last:pb-0"
                  value={value}
                >
                  {SORT_BY_LABELS[value]}
                </SelectItem>
                <SelectSeparator className="last:hidden" />
              </React.Fragment>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
