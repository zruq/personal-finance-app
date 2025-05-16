import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { trpc } from '@/router';
import { Dialog } from '@personal-finance-app/ui/components/dialog';
import UpsertPot from './upsert-pot.form';

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
  const { mutateAsync } = useMutation(trpc.pots.upsert.mutationOptions());

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
