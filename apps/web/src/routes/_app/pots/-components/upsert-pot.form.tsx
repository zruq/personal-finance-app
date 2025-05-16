import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@personal-finance-app/ui/components/input';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/router';
import { QueryResult } from '../../-components/query-result';
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
import { Button } from '@personal-finance-app/ui/components/button';

const potSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().max(30).min(1),
  target: z.number({ coerce: true }).positive(),
  themeId: z.number(),
});

export type PotFormData = z.infer<typeof potSchema>;

type UpsertPotProps = {
  defaultValues?: PotFormData;
  onSubmit: SubmitHandler<PotFormData>;
  submitButtonText: string;
  usedThemesIds: number[];
};
export default function UpsertPot({
  defaultValues,
  onSubmit,
  submitButtonText,
  usedThemesIds,
}: UpsertPotProps) {
  const { register, handleSubmit, watch, control } = useForm<PotFormData>({
    defaultValues,
    resolver: zodResolver(potSchema),
  });

  const name = watch('name');
  const charactersLeft = 30 - (name?.trim()?.length ?? 0);
  const themesQuery = useQuery(trpc.themes.all.queryOptions());
  return (
    <QueryResult
      data={themesQuery.data}
      isError={themesQuery.isError}
      isPending={themesQuery.isPending}
      error={themesQuery.error}
    >
      {(themes) => (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 pb-5">
            <Input
              label="Pot Name"
              helperText={`${charactersLeft} characters left`}
              {...register('name')}
              placeholder="e.g. Rainy Days"
            />

            <Input
              prefixNode={
                <span className="text-preset-4 text-beige-500">$</span>
              }
              label="Target"
              type="number"
              placeholder="e.g. 2000"
              {...register('target')}
            />

            <Controller
              control={control}
              name="themeId"
              render={({ field }) => {
                if (themes.length === 0) {
                  throw new Error('Themes not found');
                }
                const selectedId = field?.value ?? themes[0]!.id;
                const theme =
                  themes.find((theme) => theme.id === selectedId) ?? themes[0]!;
                return (
                  <Select
                    value={selectedId.toString()}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <label
                      htmlFor="select-theme"
                      className="text-grey-500 text-preset-5 pb-1 font-bold"
                    >
                      Color Tag
                    </label>

                    <SelectTrigger id="select-theme">
                      <SelectValue>
                        <div className="flex w-full flex-1 items-center gap-x-3">
                          <div
                            className="size-4 rounded-full"
                            style={{ backgroundColor: theme.color }}
                          ></div>
                          <span className="capitalize">{theme.name}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {themes.map((theme) => {
                          const alreadyUsed = usedThemesIds.includes(theme.id);
                          return (
                            <React.Fragment key={theme.id}>
                              <SelectItem
                                disabled={alreadyUsed}
                                className={classNames(
                                  'py-3 first:pt-0 last:pb-0',
                                  {
                                    '[&_svg]:hidden': alreadyUsed,
                                  },
                                )}
                                value={theme.id.toString()}
                              >
                                <div className="flex w-full flex-1 items-center justify-between">
                                  <div className="flex w-full flex-1 items-center gap-x-3">
                                    <div
                                      style={{ backgroundColor: theme.color }}
                                      className={classNames(
                                        'size-4 rounded-full',
                                        { 'opacity-25': alreadyUsed },
                                      )}
                                    ></div>
                                    <span className="capitalize">
                                      {theme.name}
                                    </span>
                                  </div>
                                  {alreadyUsed && (
                                    <span className="text-preset-5 text-grey-500">
                                      Already used
                                    </span>
                                  )}
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
