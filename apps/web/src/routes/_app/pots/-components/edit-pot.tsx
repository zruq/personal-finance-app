import { Dialog } from '@personal-finance-app/ui/components/dialog';
import { useMutation } from '@tanstack/react-query';
import type { RouterOutputs } from '@personal-finance-app/api/server';
import UpsertPot from './upsert-pot.form';
import { trpc } from '@/router';

type EditPotProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pot: Pick<
    RouterOutputs['pots']['all'][number],
    'id' | 'theme' | 'name' | 'target'
  >;
  usedThemesIds: number[];
};

export default function EditPot({
  open,
  onOpenChange,
  pot,
  usedThemesIds,
}: EditPotProps) {
  const { mutateAsync } = useMutation(trpc.pots.upsert.mutationOptions());

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Pot"
      description="If your saving targets change, feel free to update your pots."
    >
      <UpsertPot
        usedThemesIds={usedThemesIds}
        defaultValues={{ ...pot, themeId: pot.theme.id }}
        onSubmit={async (data) => {
          await mutateAsync(data);
          onOpenChange(false);
        }}
        submitButtonText="Save Changes"
      />
    </Dialog>
  );
}
