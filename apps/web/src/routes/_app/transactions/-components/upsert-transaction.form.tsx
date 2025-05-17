import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@personal-finance-app/ui/components/button';
import { Input } from '@personal-finance-app/ui/components/input';
import { DatePicker } from '@personal-finance-app/ui/components/date-picker';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@personal-finance-app/ui/components/select';
import { classNames } from '@personal-finance-app/ui/lib/utils';
import { useQueries } from '@tanstack/react-query';
import * as React from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { QueryResult } from '../../-components/query-result';
import { trpc } from '@/router';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@personal-finance-app/ui/components/avatar';

const transactionSchema = z.object({
  id: z.number().optional(),
  amount: z.number({ coerce: true }),
  date: z.date(),
  category: z.string(),
  budgetId: z.number().optional(),
  description: z.string().optional(),
  partyId: z.number().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

type UpsertTransactionProps = {
  defaultValues?: TransactionFormData;
  onSubmit: SubmitHandler<TransactionFormData>;
  submitButtonText: string;
};

export default function UpsertTransaction({
  defaultValues,
  onSubmit,
  submitButtonText,
}: UpsertTransactionProps) {
  const { register, handleSubmit, control, setValue, getValues } =
    useForm<TransactionFormData>({
      defaultValues,
      resolver: zodResolver(transactionSchema),
    });

  const { data, error, isError, isPending } = useQueries({
    queries: [
      trpc.budgets.list.queryOptions(),
      trpc.parties.all.queryOptions(),
    ],
    combine: ([budgetsQuery, partiesQuery]) => {
      if (budgetsQuery.isPending || partiesQuery.isPending) {
        return {
          isPending: true,
          isError: false,
        };
      }
      if (budgetsQuery.isError || partiesQuery.isError) {
        return {
          isPending: false,
          isError: true,
          error: budgetsQuery.error ?? partiesQuery.error,
        };
      }
      return {
        isPending: false,
        isError: false,
        data: { budgets: budgetsQuery.data, parties: partiesQuery.data },
      };
    },
  });
  return (
    <QueryResult
      data={data}
      isError={isError}
      isPending={isPending}
      error={error}
    >
      {({ budgets, parties }) => (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 pb-5">
            <Input
              label="Category"
              {...register('category')}
              placeholder="e.g. General"
            />

            <Input
              prefixNode={
                <span className="text-preset-4 text-beige-500">$</span>
              }
              label="Amount"
              type="number"
              placeholder="e.g. 2000"
              {...register('amount')}
            />

            <Controller
              name="date"
              render={({ field }) => (
                <DatePicker
                  label="Transaction Date"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
              control={control}
            />
            <Controller
              control={control}
              name="budgetId"
              render={({ field }) => {
                const budget = budgets.find(
                  (budget) => budget.id === field.value,
                );
                return (
                  <Select
                    value={field?.value?.toString() ?? 'none'}
                    onValueChange={(value) => {
                      if (value === 'none') {
                        field.onChange(undefined);
                        return;
                      }
                      field.onChange(Number(value));
                      const category = getValues('category');
                      const budget = budgets.find(
                        (budget) => budget.id === Number(value),
                      );
                      if (budget) {
                        setValue('category', category || budget.name);
                      }
                    }}
                  >
                    <label htmlFor="select-budget">
                      <div className="flex justify-between items-center pb-1">
                        <span className="text-grey-500 text-preset-5 font-bold">
                          Budget
                        </span>
                        <span className="text-grey-300 text-preset-5">
                          Optional
                        </span>
                      </div>
                    </label>

                    <SelectTrigger id="select-budget">
                      <SelectValue>
                        {budget ? (
                          <div className="flex w-full flex-1 items-center gap-x-3">
                            <div
                              className="size-4 rounded-full"
                              style={{ backgroundColor: budget.theme.color }}
                            ></div>
                            <span className="capitalize">{budget.name}</span>
                          </div>
                        ) : (
                          <div className="text-grey-300 text-preset-4">
                            Select a budget
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          className={classNames('pb-3')}
                          value={'none'}
                        >
                          <div className="flex w-full flex-1 items-center justify-between">
                            <div className="flex items-center gap-x-3">
                              <div className="size-4 rounded-full bg-grey-900"></div>
                              <span className="capitalize">None</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectSeparator />

                        {budgets.map((budget) => {
                          return (
                            <React.Fragment key={budget.id}>
                              <SelectItem
                                className={classNames('py-3 last:pb-0')}
                                value={budget.id.toString()}
                              >
                                <div className="flex w-full flex-1 items-center justify-between">
                                  <div className="flex items-center gap-x-3">
                                    <div
                                      className="size-4 rounded-full"
                                      style={{
                                        backgroundColor: budget.theme.color,
                                      }}
                                    ></div>
                                    <span className="capitalize">
                                      {budget.name}
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectSeparator className="last:hidden" />
                            </React.Fragment>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                );
              }}
            />
            <Controller
              control={control}
              name="partyId"
              render={({ field }) => {
                const party = parties.find((party) => party.id === field.value);
                return (
                  <Select
                    value={field?.value?.toString() ?? 'none'}
                    onValueChange={(value) => {
                      if (value === 'none') {
                        field.onChange(undefined);
                        return;
                      }
                      field.onChange(Number(value));
                    }}
                  >
                    <label htmlFor="select-budget">
                      <div className="flex justify-between items-center pb-1">
                        <span className="text-grey-500 text-preset-5 font-bold">
                          Recipient / Sender
                        </span>
                        <span className="text-grey-300 text-preset-5">
                          Optional
                        </span>
                      </div>
                    </label>

                    <SelectTrigger id="select-budget">
                      <SelectValue>
                        {party ? (
                          <div className="flex w-full flex-1 items-center gap-x-3">
                            <Avatar className="size-4">
                              <AvatarImage
                                src={party.avatar ?? undefined}
                                alt={party.name}
                              />
                              <AvatarFallback className="text-[0.6rem]">
                                {party.name.slice(0, 2) ?? 'Un'}
                              </AvatarFallback>
                            </Avatar>

                            <span className="capitalize">{party.name}</span>
                          </div>
                        ) : (
                          <div className="text-grey-300 text-preset-4">
                            Select a budget
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          className={classNames('pb-3')}
                          value={'none'}
                        >
                          <div className="flex w-full flex-1 items-center justify-between">
                            <div className="flex items-center gap-x-3">
                              <div className="size-4 rounded-full bg-grey-900"></div>
                              <span className="capitalize">None</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectSeparator />

                        {parties.map((party) => {
                          return (
                            <React.Fragment key={party.id}>
                              <SelectItem
                                className={classNames('py-3 last:pb-0')}
                                value={party.id.toString()}
                              >
                                <div className="flex w-full flex-1 items-center justify-between">
                                  <div className="flex items-center gap-x-3">
                                    <Avatar className="size-4">
                                      <AvatarImage
                                        src={party.avatar ?? undefined}
                                        alt={party.name}
                                      />
                                      <AvatarFallback className="text-[0.6rem]">
                                        {party.name.slice(0, 2) ?? 'Un'}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="capitalize">
                                      {party.name}
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectSeparator className="last:hidden" />
                            </React.Fragment>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                );
              }}
            />
          </div>

          <Button className="w-full">{submitButtonText}</Button>
        </form>
      )}
    </QueryResult>
  );
}
