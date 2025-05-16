import { Spinner } from '@personal-finance-app/ui/components/spinner';
import * as React from 'react';

type QueryResultProps<TData, TError> = {
  data: TData | undefined;
  error: TError | undefined;
  isPending: boolean;
  isError: boolean;
  children: (data: TData) => React.ReactNode;
  customLoading?: React.ReactNode;
  customError?: (error: TError) => React.ReactNode;
};

function QueryResult<TData, TError>({
  isPending,
  isError,
  error,
  customError,
  customLoading,
  children,
  data,
}: QueryResultProps<TData, TError>) {
  if (isPending) {
    return customLoading ?? <Spinner />;
  }
  if (isError) {
    return (
      customError?.(error!) ?? (
        <div className="text-red-500 text-preset-5">
          Something wrong happened
        </div>
      )
    );
  }
  return children(data!);
}

export { QueryResult };
