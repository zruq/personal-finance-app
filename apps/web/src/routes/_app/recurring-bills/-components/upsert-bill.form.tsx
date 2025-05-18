import { zodResolver } from '@hookform/resolvers/zod';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@personal-finance-app/ui/components/avatar';
import { Button } from '@personal-finance-app/ui/components/button';
import { DatePicker } from '@personal-finance-app/ui/components/date-picker';
import { Input } from '@personal-finance-app/ui/components/input';
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
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { QueryResult } from '../../-components/query-result';
import { trpc } from '@/router';

const billSchema = z.object({
  id: z.number().optional(),
  partyId: z.number(),
  name: z.string().trim().min(1).max(256),
  amount: z.number({ coerce: true }).positive(),
  startDate: z.date(),
  endDate: z.date().optional(),
  daysBetween: z.number().int().positive(),
});

export type BillFormData = z.infer<typeof billSchema>;

export const recurrenceOptions = [
  { value: '7', label: 'Weekly', description: '(7 days)' },
  { value: '14', label: 'Bi-weekly', description: '(14 days)' },
  { value: '30', label: 'Monthly', description: '(30 days)' },
  { value: '91', label: 'Quarterly', description: '(91 days)' },
  { value: '182', label: 'Semi-annually', description: '(182 days)' },
  { value: '365', label: 'Annually', description: '(365 days)' },
];

type UpsertBillProps = {
  defaultValues?: BillFormData;
  onSubmit: SubmitHandler<BillFormData>;
  submitButtonText: string;
};

export default function UpsertBill({
  defaultValues,
  onSubmit,
  submitButtonText,
}: UpsertBillProps) {
  const { register, handleSubmit, control, setValue } = useForm<BillFormData>({
    defaultValues: {
      daysBetween: 30,
      startDate: new Date(),
      ...defaultValues,
    },
    resolver: zodResolver(billSchema),
  });

  const partiesQuery = useQuery(trpc.parties.all.queryOptions());

  return (
    <QueryResult
      data={partiesQuery.data}
      isError={partiesQuery.isError}
      isPending={partiesQuery.isPending}
      error={partiesQuery.error}
    >
      {(parties) => (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 pb-5">
            <Input
              label="Bill Name"
              {...register('name')}
              placeholder="e.g. Electricity Bill"
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
                    <label htmlFor="select-party">
                      <div className="flex justify-between items-center pb-1">
                        <span className="text-grey-500 text-preset-5 font-bold">
                          Recipient / Sender
                        </span>
                        <span className="text-grey-300 text-preset-5">
                          Optional
                        </span>
                      </div>
                    </label>

                    <SelectTrigger id="select-party">
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
                            Select a company
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
            <Input
              prefixNode={
                <span className="text-preset-4 text-beige-500">$</span>
              }
              label="Amount"
              type="number"
              placeholder="e.g. 100"
              {...register('amount')}
            />
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Start Date"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="End Date (Optional)"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="daysBetween"
              control={control}
              render={({ field }) => {
                const selectedOption = recurrenceOptions.find(
                  (option) => option.value === field.value.toString(),
                );
                return (
                  <div>
                    <label
                      htmlFor="select-days-between"
                      className="text-grey-500 text-preset-5 pb-1 font-bold"
                    >
                      Recurrence
                    </label>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => {
                        setValue('daysBetween', Number(value));
                      }}
                    >
                      <SelectTrigger id="select-days-between">
                        <SelectValue>
                          {selectedOption
                            ? `${selectedOption.label} ${selectedOption.description}`
                            : 'Select recurrence'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {recurrenceOptions.map((option) => (
                            <React.Fragment key={option.value}>
                              <SelectItem
                                className={classNames(
                                  'py-3 first:pt-0 last:pb-0',
                                )}
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                              <SelectSeparator className="last:hidden" />
                            </React.Fragment>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
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
