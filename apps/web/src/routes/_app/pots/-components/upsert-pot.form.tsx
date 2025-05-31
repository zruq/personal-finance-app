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

const potSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .trim()
    .max(30, 'Name must be at most 30 characters long')
    .min(1, 'Name must be at least 1 character long'),
  target: z
    .number({ coerce: true })
    .positive('Target must be a positive number'),
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
  const { data: themes } = useSuspenseQuery(trpc.themes.all.queryOptions());
  const firstUnusedThemeId = themes.find(
    (theme) => !usedThemesIds.includes(theme.id),
  )?.id;
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PotFormData>({
    defaultValues: { themeId: firstUnusedThemeId, ...defaultValues },
    resolver: zodResolver(potSchema),
  });

  const name = watch('name');
  const charactersLeft = 30 - (name?.trim()?.length ?? 0);
  const hasExceededLimit = name?.trim()?.length > 30;
  const charactersLeftMessage = hasExceededLimit
    ? `${name.trim().length - 30} characters over the limit`
    : `${charactersLeft} characters left`;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 pb-5">
        <Input
          label="Pot Name"
          helperText={charactersLeftMessage}
          {...register('name')}
          placeholder="e.g. Rainy Days"
          error={errors.name?.message}
          helperTextClassName={hasExceededLimit ? 'text-red' : ''}
        />

        <Input
          prefixNode={<span className="text-preset-4 text-beige-500">$</span>}
          label="Target"
          type="number"
          placeholder="e.g. 2000"
          {...register('target')}
          error={errors.target?.message}
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
                              <div className="flex w-full flex-1 items-center gap-x-3">
                                <div
                                  style={{ backgroundColor: theme.color }}
                                  className={classNames('size-4 rounded-full', {
                                    'opacity-25': alreadyUsed,
                                  })}
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

      <Button className="w-full flex items-center justify-center gap-x-2">
        {isSubmitting && (
          <CircleNotchIcon
            className="-ms-1 animate-spin size-5"
            aria-hidden="true"
          />
        )}
        {submitButtonText}
      </Button>
    </form>
  );
}
