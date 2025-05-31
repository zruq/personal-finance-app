import { Dialog } from '@personal-finance-app/ui/components/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import UpsertTransaction from './upsert-transaction.form';
import { trpc } from '@/router';

type CreateTransactionProps = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateTransaction({
  open,
  onOpenChange,
}: CreateTransactionProps) {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(
    trpc.transactions.upsert.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.transactions.many.queryKey(),
        });
      },
    }),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Transaction"
      description="Log your transactions to keep track of your income and expenses. This helps you monitor your financial activities and stay on budget."
    >
      <UpsertTransaction
        onSubmit={async (data) => {
          await mutateAsync(data);
          onOpenChange(false);
        }}
        submitButtonText="Add Transaction"
      />
    </Dialog>
  );
}
