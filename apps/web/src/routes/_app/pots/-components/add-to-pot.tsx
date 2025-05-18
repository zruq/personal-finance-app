import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@personal-finance-app/ui/components/button';
import { Dialog } from '@personal-finance-app/ui/components/dialog';
import { Input } from '@personal-finance-app/ui/components/input';
import { useMutation } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import type { RouterOutputs } from '@personal-finance-app/api/server';
import Progress from './progress';
import { trpc } from '@/router';

const transactionSchema = z.object({
  amount: z.number({ coerce: true }).positive(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

type AddToPotProps = {
  defaultValues?: TransactionFormData;
  pot: RouterOutputs['pots']['all'][number];
  type: 'add' | 'withdraw';
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const labels = {
  add: {
    submitButton: 'Confirm Addition',
    input: 'Amount to Add',
    title: (potName: string) => `Add to ‘${potName}’`,
    description:
      'Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance.',
  },
  withdraw: {
    submitButton: 'Confirm Withdrawal',
    input: 'Amount to Withdraw',
    title: (potName: string) => `Withdraw from ‘${potName}’`,
    description:
      'Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot.',
  },
};
export default function AddToPot({
  defaultValues,
  type,
  pot,
  open,
  onOpenChange,
}: AddToPotProps) {
  const factor = type === 'withdraw' ? -1 : 1;
  const { mutateAsync } = useMutation(trpc.pots.addTo.mutationOptions());
  const { register, handleSubmit, watch, reset } = useForm<TransactionFormData>(
    {
      defaultValues,
      resolver: zodResolver(transactionSchema),
    },
  );

  const amount = Number(watch('amount'));

  const onSubmit: SubmitHandler<TransactionFormData> = async (data) => {
    await mutateAsync({ potId: pot.id, amount: factor * data.amount });
    reset();
    onOpenChange(false);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={labels[type].title(pot.name)}
      description={labels[type].description}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Progress
          label="New Amount"
          totalValue={pot.target}
          currentValue={pot.totalSaved}
          removedValue={type === 'withdraw' ? amount : undefined}
          addedValue={type === 'add' ? amount : undefined}
          theme={pot.theme}
        />
        <div className="pb-5">
          <Input
            prefixNode={<span className="text-preset-4 text-beige-500">$</span>}
            label={labels[type].input}
            type="number"
            placeholder="e.g. 2000"
            {...register('amount')}
          />
        </div>

        <Button className="w-full">{labels[type].submitButton}</Button>
      </form>
    </Dialog>
  );
}
