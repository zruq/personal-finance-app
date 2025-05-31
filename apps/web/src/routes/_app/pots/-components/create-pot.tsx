import { Dialog } from '@personal-finance-app/ui/components/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import UpsertPot from './upsert-pot.form';
import { trpc } from '@/router';

type CreatePotProps = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  usedThemesIds: Array<number>;
};

export default function CreatePot({
  open,
  onOpenChange,
  usedThemesIds,
}: CreatePotProps) {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(
    trpc.pots.upsert.mutationOptions({
      onSuccess(data) {
        queryClient.setQueryData(
          trpc.pots.all.queryOptions().queryKey,
          (old) => (old ? [{ ...data, totalSaved: 0 }, ...old] : undefined),
        );
      },
    }),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Pot"
      description="Create a pot to set savings targets. These can help keep you on track as you save for special purchases."
    >
      <UpsertPot
        usedThemesIds={usedThemesIds}
        onSubmit={async (data) => {
          await mutateAsync(data);
          onOpenChange(false);
        }}
        submitButtonText="Add Pot"
      />
    </Dialog>
  );
}
