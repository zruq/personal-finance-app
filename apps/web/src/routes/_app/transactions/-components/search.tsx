import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { Route } from '../route';
import { Input } from '@personal-finance-app/ui/components/input';
import SearchIcon from '@personal-finance-app/ui/icons/search.icon';
import useDebounce from '@personal-finance-app/ui/hooks/use-debounce';

export default function Search() {
  const [search, setSearch] = React.useState('');
  const navigate = useNavigate({ from: Route.fullPath });
  const debouncedSearchValue = useDebounce(search, 500);
  React.useEffect(() => {
    navigate({
      search: (prev) => ({ ...prev, search: debouncedSearchValue }),
    });
  }, [debouncedSearchValue, navigate]);
  return (
    <Input
      label="Search transaction"
      hideLabel
      placeholder="Search transaction"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      suffixNode={<SearchIcon className="fill-grey-900 h-4 w-4" />}
      className="w-[215px] placeholder:truncate md:w-[161px] xl:w-[320px]"
    />
  );
}
