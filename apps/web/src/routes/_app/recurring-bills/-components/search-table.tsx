import { Input } from '@personal-finance-app/ui/components/input';
import useDebounce from '@personal-finance-app/ui/hooks/use-debounce';
import SearchIcon from '@personal-finance-app/ui/icons/search.icon';
import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { Route } from '..';

export default function Search() {
  const [search, setSearch] = React.useState('');
  const navigate = useNavigate({ from: Route.fullPath });
  const debouncedSearchValue = useDebounce(search, 500);
  React.useEffect(() => {
    navigate({
      search: (prev) => ({ ...prev, search: debouncedSearchValue }),
    });
  }, [debouncedSearchValue, navigate]);
  const searchParams = Route.useSearch();
  React.useEffect(() => {
    if (searchParams.search !== undefined) {
      setSearch(searchParams.search);
    }
  }, [searchParams.search]);
  return (
    <Input
      label="Search bills"
      hideLabel
      placeholder="Search bills"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      suffixNode={<SearchIcon className="fill-grey-900 h-4 w-4" />}
      className="w-[215px] placeholder:truncate md:w-[161px] xl:w-[320px]"
    />
  );
}
