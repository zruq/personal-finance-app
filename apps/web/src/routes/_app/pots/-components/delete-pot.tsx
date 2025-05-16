import { trpc } from '@/router';
import { Button } from '@personal-finance-app/ui/components/button';
import { Dialog } from '@personal-finance-app/ui/components/dialog';
import { useMutation } from '@tanstack/react-query';
import * as React from 'react';

type DeletePotProps = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  pot: { id: number; name: string };
};

export default function DeletePot({ open, onOpenChange, pot }: DeletePotProps) {
  const { mutate } = useMutation(trpc.pots.delete.mutationOptions());

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Delete ‘${pot.name}’?`}
      description="Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever."
    >
      <div className="flex flex-col space-y-5">
        <Button
          onClick={() => {
            mutate({ id: pot.id });
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
