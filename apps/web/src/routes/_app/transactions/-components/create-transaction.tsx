import { Dialog } from '@personal-finance-app/ui/components/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { trpc } from '@/router';
import UpsertTransaction from './upsert-transaction.form';

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
    trpc.transactions.upsert.mutationOptions(),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Transaction"
      description="TODO"
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
