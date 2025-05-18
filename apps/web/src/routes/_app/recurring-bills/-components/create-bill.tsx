import { Dialog } from '@personal-finance-app/ui/components/dialog';
import { useMutation } from '@tanstack/react-query';
import * as React from 'react';
import UpsertBill from './upsert-bill.form';
import { trpc } from '@/router';

type CreateBillProps = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateBill({ open, onOpenChange }: CreateBillProps) {
  const { mutateAsync } = useMutation(trpc.bills.upsert.mutationOptions());
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Bill"
      description="TODO"
    >
      <UpsertBill
        onSubmit={async (data) => {
          await mutateAsync(data);
          onOpenChange(false);
        }}
        submitButtonText="Add Bill"
      />
    </Dialog>
  );
}
