import { Dialog } from '@personal-finance-app/ui/components/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RouterInputs } from '@personal-finance-app/api/server';
import UpsertBudget from './upsert-budget.form';
import { trpc } from '@/router';

type EditBudgetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget: RouterInputs['budgets']['upsert'] & { id: number };
  usedThemesIds: Array<number>;
};

export default function EditBudget({
  open,
  onOpenChange,
  budget,
  usedThemesIds,
}: EditBudgetProps) {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(
    trpc.budgets.upsert.mutationOptions({
      onSuccess(data) {
        queryClient.setQueryData(
          trpc.budgets.all.queryOptions().queryKey,
          (old) =>
            old?.map((budget) =>
              budget.id === data.id ? { ...budget, ...data } : budget,
            ),
        );
      },
    }),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Budget"
      description="If your saving targets change, feel free to update your budgets."
    >
      <UpsertBudget
        usedThemesIds={usedThemesIds.filter(
          (theme) => theme !== budget.themeId,
        )}
        defaultValues={budget}
        onSubmit={async (data) => {
          await mutateAsync({ ...data, id: budget.id });
          onOpenChange(false);
        }}
        submitButtonText="Save Changes"
      />
    </Dialog>
  );
}
