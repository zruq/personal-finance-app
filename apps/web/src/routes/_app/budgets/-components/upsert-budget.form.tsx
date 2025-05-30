import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@personal-finance-app/ui/components/button';
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
import { useSuspenseQuery } from '@tanstack/react-query';
import * as React from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { trpc } from '@/router';
import { CircleNotchIcon } from '@phosphor-icons/react/dist/ssr/CircleNotch';

const budgetSchema = z.object({
  name: z.string().trim().min(1),
  maximumSpend: z.number({ coerce: true }).positive(),
  themeId: z.number(),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;

type UpsertBudgetProps = {
  defaultValues?: BudgetFormData;
  onSubmit: SubmitHandler<BudgetFormData>;
  submitButtonText: string;
  usedThemesIds: Array<number>;
};

export default function UpsertBudget({
  defaultValues,
  onSubmit,
  submitButtonText,
  usedThemesIds,
}: UpsertBudgetProps) {
  const { data: themes } = useSuspenseQuery(trpc.themes.all.queryOptions());
  const firstUnusedThemeId = themes.find(
    (theme) => !usedThemesIds.includes(theme.id),
  )?.id;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    defaultValues: { themeId: firstUnusedThemeId, ...defaultValues },
    resolver: zodResolver(budgetSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 pb-5">
        <Input
          label="Name"
          {...register('name')}
          error={errors.name?.message}
        />

        <Input
          prefixNode={<span className="text-preset-4 text-beige-500">$</span>}
          label="Target"
          type="number"
          step={0.01}
          placeholder="e.g. 2000"
          {...register('maximumSpend')}
          error={errors.maximumSpend?.message}
        />

        <Controller
          control={control}
          name="themeId"
          render={({ field }) => {
            const selectedId = field?.value;
            const theme = themes.find((theme) => theme.id === selectedId);
            if (!theme) {
              throw new Error('no theme selected');
            }
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
                            className={classNames('py-3 first:pt-0 last:pb-0', {
                              '[&_svg]:hidden': alreadyUsed,
                            })}
                            value={theme.id.toString()}
                          >
                            <div className="flex w-full flex-1 items-center justify-between">
                              <div className="flex items-center gap-x-3">
                                <div
                                  className="size-4 rounded-full"
                                  style={{ backgroundColor: theme.color }}
                                ></div>
                                <span className="capitalize">{theme.name}</span>
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

      <Button
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-x-2"
      >
        {isSubmitting && (
          <CircleNotchIcon
            className="-ms-1 animate-spin size-5"
            aria-hidden="true"
          />
        )}{' '}
        {submitButtonText}
      </Button>
    </form>
  );
}
