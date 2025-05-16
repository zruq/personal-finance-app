import { Dialog } from '@personal-finance-app/ui/components/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import UpsertBudget from './upsert-budget.form';
import { trpc } from '@/router';

type CreateBudgetProps = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  usedThemesIds: Array<number>;
};

export default function CreateBudget({
  open,
  onOpenChange,
  usedThemesIds,
}: CreateBudgetProps) {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(
    trpc.budgets.upsert.mutationOptions({
      onSuccess(data) {
        queryClient.setQueryData(
          trpc.budgets.all.queryOptions().queryKey,
          (old) =>
            old
              ? [{ ...data, latestSpending: [], spent: 0 }, ...old]
              : undefined,
        );
      },
    }),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Budget"
      description="Choose a category to set a spending budget. These categories can help you monitor spending."
    >
      <UpsertBudget
        usedThemesIds={usedThemesIds}
        onSubmit={async (data) => {
          await mutateAsync(data);
          onOpenChange(false);
        }}
        submitButtonText="Add Budget"
      />
    </Dialog>
  );
}
