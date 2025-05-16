import { Button } from '@personal-finance-app/ui/components/button';
import { Dialog } from '@personal-finance-app/ui/components/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { trpc } from '@/router';

type DeleteBudgetProps = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  budget: { id: number; name: string };
};

export default function DeleteBudget({
  open,
  onOpenChange,
  budget,
}: DeleteBudgetProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    trpc.budgets.delete.mutationOptions({
      onSuccess(data) {
        queryClient.setQueryData(
          trpc.budgets.all.queryOptions().queryKey,
          (old) => old?.filter((budget) => budget.id !== data.id),
        );
      },
    }),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Delete ‘${budget.name}’?`}
      description="Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever."
    >
      <div className="flex flex-col space-y-5">
        <Button
          onClick={() => {
            mutate({ id: budget.id });
          }}
          variant="destroy"
          className="w-full"
        >
          Yes, Confirm Deletion
        </Button>
        <Button
          onClick={() => onOpenChange(false)}
          variant="tertiary"
          className="w-full py-0"
        >
          No, Go Back
        </Button>
      </div>
    </Dialog>
  );
}
